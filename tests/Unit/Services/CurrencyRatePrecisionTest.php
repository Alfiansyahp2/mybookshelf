<?php

namespace Tests\Unit\Services;

use App\Models\CurrencyRate;
use App\Services\Accounting\CurrencyRateService;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurrencyRatePrecisionTest extends TestCase
{
    use RefreshDatabase;

    private CurrencyRateService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(CurrencyRateService::class);
    }

    public function test_decimal_precision_rates_convert_accurately_for_both_large_and_fractional_multipliers(): void
    {
        $this->service->setRate('USD', 'IDR', 15876.543210);
        $this->service->setRate('JPY', 'IDR', 105.123456);
        $this->service->setRate('IDR', 'USD', 0.000063);

        $usdResult = $this->service->convertAmount(19.99, 'USD', 'IDR');
        $this->assertSame(round(19.99 * 15876.543210, 2), $usdResult['converted_amount']);
        $this->assertEqualsWithDelta(15876.543210, $usdResult['rate'], 0.000001);

        $jpyResult = $this->service->convertAmount(1500, 'jpy', 'idr');
        $this->assertSame('JPY', $jpyResult['from_currency']);
        $this->assertSame('IDR', $jpyResult['to_currency']);
        $this->assertSame(round(1500 * 105.123456, 2), $jpyResult['converted_amount']);

        $inverseResult = $this->service->convertAmount(1000000, 'IDR', 'USD');
        $this->assertSame(round(1000000 * 0.000063, 2), $inverseResult['converted_amount']);
    }

    public function test_identity_currency_conversion_short_circuits_with_exact_amount(): void
    {
        $result = $this->service->convertAmount(123456.78, 'idr', 'IDR');

        $this->assertSame(123456.78, $result['converted_amount']);
        $this->assertSame(1.0, $result['rate']);
    }

    public function test_expired_and_inactive_rates_are_excluded_from_conversion_and_fallback_applies_safely(): void
    {
        CurrencyRate::create([
            'from_currency' => 'EUR',
            'to_currency' => 'IDR',
            'rate' => 99999.0,
            'effective_date' => now()->subDays(5),
            'expires_at' => now()->subMinute(),
            'is_active' => true,
        ]);

        CurrencyRate::create([
            'from_currency' => 'EUR',
            'to_currency' => 'IDR',
            'rate' => 88888.0,
            'effective_date' => now()->subHour(),
            'is_active' => false,
        ]);

        // Fallback conversion must ignore expired & inactive rates and use conservative EUR fallback (16500)
        $fallbackAmount = $this->service->convertToIdrWithFallback(2.5, 'EUR');
        $this->assertSame(2.5 * 16500.0, $fallbackAmount);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('No exchange rate found for EUR to IDR');
        $this->service->convertAmount(10.0, 'EUR', 'IDR');
    }

    public function test_set_rate_updates_existing_same_day_rate_unless_forced(): void
    {
        $first = $this->service->setRate('SGD', 'IDR', 11500.25);
        $updated = $this->service->setRate('SGD', 'IDR', 11650.75);

        $this->assertSame($first->id, $updated->id);
        $this->assertEqualsWithDelta(11650.75, (float) $updated->rate, 0.0001);
        $this->assertSame(1, CurrencyRate::forPair('SGD', 'IDR')->count());

        $forced = $this->service->setRate('SGD', 'IDR', 11700.00, [
            'force' => true,
            'effective_date' => now()->addSecond(),
        ]);
        $this->assertNotSame($first->id, $forced->id);
        $this->assertSame(2, CurrencyRate::forPair('SGD', 'IDR')->count());
    }
}
