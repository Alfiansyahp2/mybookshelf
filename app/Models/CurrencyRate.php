<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CurrencyRate extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'from_currency',
        'to_currency',
        'rate',
        'effective_date',
        'expires_at',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rate' => 'decimal:6',
        'effective_date' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Scope to get active rates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('effective_date', '<=', now())
                    ->where(function ($q) {
                        $q->where('expires_at', '>', now())
                          ->orWhereNull('expires_at');
                    });
    }

    /**
     * Scope to filter by currency pair.
     */
    public function scopeForPair($query, $fromCurrency, $toCurrency = 'IDR')
    {
        return $query->where('from_currency', strtoupper($fromCurrency))
                    ->where('to_currency', strtoupper($toCurrency));
    }

    /**
     * Get the latest rate for a currency pair.
     */
    public static function getLatestRate(string $fromCurrency, string $toCurrency = 'IDR'): ?self
    {
        return static::active()
                    ->forPair($fromCurrency, $toCurrency)
                    ->orderBy('effective_date', 'desc')
                    ->first();
    }

    /**
     * Convert amount from one currency to another.
     */
    public static function convert(float $amount, string $fromCurrency, string $toCurrency = 'IDR'): float
    {
        if ($fromCurrency === $toCurrency) {
            return $amount;
        }

        $rate = static::getLatestRate($fromCurrency, $toCurrency);

        if (!$rate) {
            // If no rate found, return 0 or throw exception
            return 0;
        }

        return $amount * $rate->rate;
    }

    /**
     * Get formatted rate.
     */
    public function getFormattedRateAttribute(): string
    {
        return '1 ' . $this->from_currency . ' = ' . number_format($this->rate, 4, ',', '.') . ' ' . $this->to_currency;
    }

    /**
     * Check if rate is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if rate is currently valid.
     */
    public function isValid(): bool
    {
        return $this->is_active &&
               $this->effective_date->isPast() &&
               !$this->isExpired();
    }
}