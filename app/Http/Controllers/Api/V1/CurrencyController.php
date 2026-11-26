<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Accounting\BulkUpsertCurrencyRatesRequest;
use App\Http\Requests\Api\V1\Accounting\ConvertCurrencyRequest;
use App\Http\Requests\Api\V1\Accounting\CurrencyCodeRequest;
use App\Http\Requests\Api\V1\Accounting\CurrencyPairRequest;
use App\Http\Requests\Api\V1\Accounting\DeactivateOldCurrencyRatesRequest;
use App\Http\Requests\Api\V1\Accounting\HistoricalCurrencyRatesRequest;
use App\Http\Requests\Api\V1\Accounting\SetCurrencyRateRequest;
use App\Services\CurrencyRateService;
use Illuminate\Http\JsonResponse;

class CurrencyController extends Controller
{
    protected $currencyRateService;

    public function __construct(CurrencyRateService $currencyRateService)
    {
        $this->currencyRateService = $currencyRateService;
    }

    /**
     * Get all currency rates.
     */
    public function getRates(): JsonResponse
    {
        try {
            $rates = $this->currencyRateService->getAllActiveRates();

            return response()->success($rates, 'Currency rates retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getRates failed');
        }
    }

    /**
     * Get rate for specific currency pair.
     */
    public function getRate(CurrencyPairRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $rate = $this->currencyRateService->getRate(
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR'
            );

            if (! $rate) {
                return $this->notFoundResponse('Currency rate not found');
            }

            return response()->success($rate, 'Currency rate retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getRate failed');
        }
    }

    /**
     * Set or update currency rate.
     */
    public function setRate(SetCurrencyRateRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $rate = $this->currencyRateService->setRate(
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR',
                $validated['rate'],
                [
                    'effective_date' => $validated['effective_date'] ?? now(),
                    'expires_at' => $validated['expires_at'] ?? null,
                    'force' => $validated['force'] ?? false,
                ]
            );

            return response()->success($rate, 'Currency rate set successfully', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::setRate failed');
        }
    }

    /**
     * Convert amount between currencies.
     */
    public function convert(ConvertCurrencyRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $conversion = $this->currencyRateService->convertAmount(
                $validated['amount'],
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR'
            );

            return response()->success($conversion, 'Currency converted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::convert failed');
        }
    }

    /**
     * Sync live currency rates from external API.
     */
    public function syncRates(): JsonResponse
    {
        try {
            $syncedRates = $this->currencyRateService->syncLiveRates();

            return response()->success($syncedRates, 'Currency rates synced successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::syncRates failed');
        }
    }

    /**
     * Get historical rates for a currency pair.
     */
    public function getHistoricalRates(HistoricalCurrencyRatesRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $rates = $this->currencyRateService->getHistoricalRates(
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR',
                $validated['date'] ?? null
            );

            return response()->success($rates, 'Historical rates retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getHistoricalRates failed');
        }
    }

    /**
     * Bulk upsert currency rates.
     */
    public function bulkUpsertRates(BulkUpsertCurrencyRatesRequest $request): JsonResponse
    {
        try {
            $results = $this->currencyRateService->bulkUpsertRates($request->validated('rates'));

            return response()->success($results, 'Currency rates bulk upserted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::bulkUpsertRates failed');
        }
    }

    /**
     * Get supported currencies list.
     */
    public function getSupportedCurrencies(): JsonResponse
    {
        try {
            $currencies = $this->currencyRateService->getSupportedCurrencies();

            return response()->success($currencies, 'Supported currencies retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getSupportedCurrencies failed');
        }
    }

    /**
     * Get currency information by code.
     */
    public function getCurrencyInfo(CurrencyCodeRequest $request): JsonResponse
    {
        try {
            $currencyInfo = $this->currencyRateService->getCurrencyInfo($request->validated('currency_code'));

            if (! $currencyInfo) {
                return $this->notFoundResponse('Currency not found');
            }

            return response()->success($currencyInfo, 'Currency information retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getCurrencyInfo failed');
        }
    }

    /**
     * Validate currency code.
     */
    public function validateCurrency(CurrencyCodeRequest $request): JsonResponse
    {
        try {
            $code = $request->validated('currency_code');
            $isValid = $this->currencyRateService->isValidCurrency($code);

            return response()->success([
                'currency_code' => $code,
                'is_valid' => $isValid,
            ], 'Currency validation completed successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::validateCurrency failed');
        }
    }

    /**
     * Deactivate old currency rates.
     */
    public function deactivateOldRates(DeactivateOldCurrencyRatesRequest $request): JsonResponse
    {
        try {
            $deactivatedCount = $this->currencyRateService->deactivateOldRates(
                $request->validated('days_to_keep') ?? 30
            );

            return response()->success([
                'deactivated_count' => $deactivatedCount,
            ], 'Old currency rates deactivated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::deactivateOldRates failed');
        }
    }
}
