<?php

namespace App\Services\Accounting;

use App\Models\CurrencyRate;
use Exception;
use Illuminate\Support\Str;

class CurrencyRateService
{
    /**
     * Conservative fallback conversion rates to IDR when no active DB rate row exists.
     */
    private const FALLBACK_RATES_TO_IDR = [
        'USD' => 15000.0,
        'EUR' => 16500.0,
        'GBP' => 19000.0,
        'JPY' => 100.0,
        'SGD' => 11000.0,
        'AUD' => 10000.0,
    ];

    /**
     * Get current exchange rate between two currencies.
     */
    public function getRate(string $fromCurrency, string $toCurrency = 'IDR'): ?CurrencyRate
    {
        // Normalize currency codes
        $fromCurrency = strtoupper($fromCurrency);
        $toCurrency = strtoupper($toCurrency);

        // If same currency, return 1:1 rate
        if ($fromCurrency === $toCurrency) {
            return new CurrencyRate([
                'from_currency' => $fromCurrency,
                'to_currency' => $toCurrency,
                'rate' => 1.0,
                'effective_date' => now(),
            ]);
        }

        return CurrencyRate::active()
            ->forPair($fromCurrency, $toCurrency)
            ->orderBy('effective_date', 'desc')
            ->first();
    }

    /**
     * Set or update exchange rate.
     */
    public function setRate(string $fromCurrency, string $toCurrency, float $rate, array $options = []): CurrencyRate
    {
        // Normalize currency codes
        $fromCurrency = strtoupper($fromCurrency);
        $toCurrency = strtoupper($toCurrency);

        // Check if rate already exists
        $existingRate = $this->getRate($fromCurrency, $toCurrency);

        if ($existingRate && ! ($options['force'] ?? false)) {
            // Update existing rate if it's from today
            if ($existingRate->effective_date->isToday()) {
                $existingRate->update([
                    'rate' => $rate,
                    'expires_at' => $options['expires_at'] ?? null,
                    'is_active' => true,
                ]);

                return $existingRate->fresh();
            }
        }

        // Create new rate
        return CurrencyRate::create([
            'id' => Str::uuid()->toString(),
            'from_currency' => $fromCurrency,
            'to_currency' => $toCurrency,
            'rate' => $rate,
            'effective_date' => $options['effective_date'] ?? now(),
            'expires_at' => $options['expires_at'] ?? null,
            'is_active' => true,
        ]);
    }

    /**
     * Convert amount from one currency to another.
     */
    public function convertAmount(float $amount, string $fromCurrency, string $toCurrency = 'IDR'): array
    {
        // Normalize currency codes
        $fromCurrency = strtoupper($fromCurrency);
        $toCurrency = strtoupper($toCurrency);

        // If same currency, no conversion needed
        if ($fromCurrency === $toCurrency) {
            return [
                'original_amount' => $amount,
                'converted_amount' => $amount,
                'from_currency' => $fromCurrency,
                'to_currency' => $toCurrency,
                'rate' => 1.0,
                'converted_at' => now(),
            ];
        }

        // Get exchange rate
        $rate = $this->getRate($fromCurrency, $toCurrency);

        if (! $rate) {
            throw new Exception("No exchange rate found for {$fromCurrency} to {$toCurrency}");
        }

        $convertedAmount = $amount * $rate->rate;

        return [
            'original_amount' => $amount,
            'converted_amount' => round($convertedAmount, 2),
            'from_currency' => $fromCurrency,
            'to_currency' => $toCurrency,
            'rate' => $rate->rate,
            'rate_date' => $rate->effective_date,
            'converted_at' => now(),
        ];
    }

    /**
     * Get all active rates.
     */
    public function getAllActiveRates(): array
    {
        $rates = CurrencyRate::active()
            ->orderBy('from_currency')
            ->orderBy('effective_date', 'desc')
            ->get()
            ->groupBy('from_currency');

        $result = [];
        foreach ($rates as $fromCurrency => $currencyRates) {
            $latestRate = $currencyRates->first();
            $result[] = [
                'from_currency' => $fromCurrency,
                'to_currency' => $latestRate->to_currency,
                'rate' => $latestRate->rate,
                'effective_date' => $latestRate->effective_date->format('Y-m-d H:i:s'),
                'formatted' => $latestRate->formatted_rate,
            ];
        }

        return $result;
    }

    /**
     * Sync live currency rates from external API (optional).
     * This is a placeholder for API integration.
     */
    public function syncLiveRates(): array
    {
        // Placeholder for external API integration
        // You can integrate with services like:
        // - exchangerate-api.com
        // - fixer.io
        // - currencyapi.com

        $syncedRates = [];

        foreach (self::FALLBACK_RATES_TO_IDR as $currency => $placeholderRate) {
            try {
                $rate = $this->setRate($currency, 'IDR', $placeholderRate, [
                    'effective_date' => now(),
                    'expires_at' => now()->endOfDay(),
                ]);

                $syncedRates[] = [
                    'currency' => $currency,
                    'rate' => $rate->rate,
                    'status' => 'synced',
                ];
            } catch (Exception $e) {
                $syncedRates[] = [
                    'currency' => $currency,
                    'rate' => null,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $syncedRates;
    }

    /**
     * Get historical rates for a currency pair.
     */
    public function getHistoricalRates(string $fromCurrency, string $toCurrency = 'IDR', ?string $date = null): array
    {
        // Normalize currency codes
        $fromCurrency = strtoupper($fromCurrency);
        $toCurrency = strtoupper($toCurrency);

        $query = CurrencyRate::forPair($fromCurrency, $toCurrency);

        if ($date) {
            $query->whereDate('effective_date', '<=', $date);
        }

        $rates = $query->orderBy('effective_date', 'desc')
            ->limit(30)
            ->get();

        return $rates->map(function ($rate) {
            return [
                'rate' => $rate->rate,
                'effective_date' => $rate->effective_date->format('Y-m-d H:i:s'),
                'is_active' => $rate->is_active,
            ];
        })->toArray();
    }

    /**
     * Deactivate old rates.
     */
    public function deactivateOldRates(int $daysToKeep = 30): int
    {
        $cutoffDate = now()->subDays($daysToKeep);

        return CurrencyRate::where('effective_date', '<', $cutoffDate)
            ->where('is_active', true)
            ->update(['is_active' => false]);
    }

    /**
     * Get rate for a specific date.
     */
    public function getRateForDate(string $fromCurrency, string $toCurrency, string $date): ?CurrencyRate
    {
        // Normalize currency codes
        $fromCurrency = strtoupper($fromCurrency);
        $toCurrency = strtoupper($toCurrency);

        // If same currency, return 1:1 rate
        if ($fromCurrency === $toCurrency) {
            return new CurrencyRate([
                'from_currency' => $fromCurrency,
                'to_currency' => $toCurrency,
                'rate' => 1.0,
                'effective_date' => $date,
            ]);
        }

        return CurrencyRate::forPair($fromCurrency, $toCurrency)
            ->where('effective_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->where('expires_at', '>=', $date)
                    ->orWhereNull('expires_at');
            })
            ->orderBy('effective_date', 'desc')
            ->first();
    }

    /**
     * Bulk create or update rates.
     */
    public function bulkUpsertRates(array $ratesData): array
    {
        $results = [];

        foreach ($ratesData as $rateData) {
            try {
                $rate = $this->setRate(
                    $rateData['from_currency'],
                    $rateData['to_currency'] ?? 'IDR',
                    $rateData['rate'],
                    $rateData['options'] ?? []
                );

                $results[] = [
                    'from_currency' => $rateData['from_currency'],
                    'to_currency' => $rateData['to_currency'] ?? 'IDR',
                    'status' => 'success',
                    'rate' => $rate->rate,
                ];
            } catch (Exception $e) {
                $results[] = [
                    'from_currency' => $rateData['from_currency'],
                    'to_currency' => $rateData['to_currency'] ?? 'IDR',
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Get supported currencies list.
     */
    public function getSupportedCurrencies(): array
    {
        return [
            ['code' => 'IDR', 'name' => 'Indonesian Rupiah', 'symbol' => 'Rp'],
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$'],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€'],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£'],
            ['code' => 'JPY', 'name' => 'Japanese Yen', 'symbol' => '¥'],
            ['code' => 'SGD', 'name' => 'Singapore Dollar', 'symbol' => 'S$'],
            ['code' => 'AUD', 'name' => 'Australian Dollar', 'symbol' => 'A$'],
            ['code' => 'CNY', 'name' => 'Chinese Yuan', 'symbol' => '¥'],
            ['code' => 'MYR', 'name' => 'Malaysian Ringgit', 'symbol' => 'RM'],
            ['code' => 'THB', 'name' => 'Thai Baht', 'symbol' => '฿'],
        ];
    }

    /**
     * Validate currency code.
     */
    public function isValidCurrency(string $currencyCode): bool
    {
        $supportedCurrencies = collect($this->getSupportedCurrencies())->pluck('code')->toArray();

        return in_array(strtoupper($currencyCode), $supportedCurrencies);
    }

    /**
     * Convert an amount into base currency (IDR), preferring active DB rates
     * and falling back to safe defaults when a pair rate has not been seeded yet.
     */
    public function convertToIdrWithFallback(float $amount, string $fromCurrency): float
    {
        $code = strtoupper(trim($fromCurrency ?: 'IDR'));
        if ($code === 'IDR' || $amount == 0.0) {
            return $amount;
        }

        $rate = $this->getRate($code, 'IDR');
        if ($rate && (float) $rate->rate > 0) {
            return $amount * (float) $rate->rate;
        }

        $fallbackRate = self::FALLBACK_RATES_TO_IDR[$code] ?? 1.0;

        return $amount * $fallbackRate;
    }

    /**
     * Get currency info by code.
     */
    public function getCurrencyInfo(string $currencyCode): ?array
    {
        $currencies = collect($this->getSupportedCurrencies());

        return $currencies->firstWhere('code', strtoupper($currencyCode));
    }
}
