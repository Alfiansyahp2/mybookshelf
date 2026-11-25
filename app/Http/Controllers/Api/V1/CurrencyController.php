<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\CurrencyRateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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
    public function getRate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'from_currency' => 'required|string|size:3',
                'to_currency' => 'nullable|string|size:3',
            ]);

            $rate = $this->currencyRateService->getRate(
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR'
            );

            if (! $rate) {
                return $this->notFoundResponse('Currency rate not found');
            }

            return response()->success($rate, 'Currency rate retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getRate failed');
        }
    }

    /**
     * Set or update currency rate.
     */
    public function setRate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'from_currency' => 'required|string|size:3',
                'to_currency' => 'nullable|string|size:3',
                'rate' => 'required|numeric|min:0',
                'effective_date' => 'nullable|date',
                'expires_at' => 'nullable|date',
                'force' => 'nullable|boolean',
            ]);

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
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::setRate failed');
        }
    }

    /**
     * Convert amount between currencies.
     */
    public function convert(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0',
                'from_currency' => 'required|string|size:3',
                'to_currency' => 'nullable|string|size:3',
            ]);

            $conversion = $this->currencyRateService->convertAmount(
                $validated['amount'],
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR'
            );

            return response()->success($conversion, 'Currency converted successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
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
    public function getHistoricalRates(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'from_currency' => 'required|string|size:3',
                'to_currency' => 'nullable|string|size:3',
                'date' => 'nullable|date',
            ]);

            $rates = $this->currencyRateService->getHistoricalRates(
                $validated['from_currency'],
                $validated['to_currency'] ?? 'IDR',
                $validated['date'] ?? null
            );

            return response()->success($rates, 'Historical rates retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getHistoricalRates failed');
        }
    }

    /**
     * Bulk upsert currency rates.
     */
    public function bulkUpsertRates(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'rates' => 'required|array|min:1',
                'rates.*.from_currency' => 'required|string|size:3',
                'rates.*.to_currency' => 'nullable|string|size:3',
                'rates.*.rate' => 'required|numeric|min:0',
                'rates.*.effective_date' => 'nullable|date',
                'rates.*.expires_at' => 'nullable|date',
            ]);

            $results = $this->currencyRateService->bulkUpsertRates($validated['rates']);

            return response()->success($results, 'Currency rates bulk upserted successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
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
    public function getCurrencyInfo(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'currency_code' => 'required|string|size:3',
            ]);

            $currencyInfo = $this->currencyRateService->getCurrencyInfo($validated['currency_code']);

            if (! $currencyInfo) {
                return $this->notFoundResponse('Currency not found');
            }

            return response()->success($currencyInfo, 'Currency information retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::getCurrencyInfo failed');
        }
    }

    /**
     * Validate currency code.
     */
    public function validateCurrency(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'currency_code' => 'required|string|size:3',
            ]);

            $isValid = $this->currencyRateService->isValidCurrency($validated['currency_code']);

            return response()->success([
                'currency_code' => $validated['currency_code'],
                'is_valid' => $isValid,
            ], 'Currency validation completed successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::validateCurrency failed');
        }
    }

    /**
     * Deactivate old currency rates.
     */
    public function deactivateOldRates(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'days_to_keep' => 'nullable|integer|min:1|max:365',
            ]);

            $deactivatedCount = $this->currencyRateService->deactivateOldRates(
                $validated['days_to_keep'] ?? 30
            );

            return response()->success([
                'deactivated_count' => $deactivatedCount,
            ], 'Old currency rates deactivated successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'CurrencyController::deactivateOldRates failed');
        }
    }
}
