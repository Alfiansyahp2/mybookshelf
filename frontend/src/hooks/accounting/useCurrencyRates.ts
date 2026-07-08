import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { currencyApi } from '../../lib/api/accounting';
import type { CurrencyRate, CurrencyConversion } from '../../types/accounting';

// Get all currency rates
export function useCurrencyRates() {
  return useQuery({
    queryKey: ['currency-rates'],
    queryFn: () => currencyApi.getRates(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Get specific rate
export function useCurrencyRate(fromCurrency: string, toCurrency?: string) {
  return useQuery({
    queryKey: ['currency-rates', fromCurrency, toCurrency || 'IDR'],
    queryFn: () => currencyApi.getRate(fromCurrency, toCurrency),
    enabled: !!fromCurrency,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Set currency rate
export function useSetCurrencyRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { from_currency: string; to_currency?: string; rate: number; effective_date?: string; expires_at?: string }) =>
      currencyApi.setRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currency-rates'] });
    },
  });
}

// Convert amount between currencies
export function useCurrencyConvert() {
  return useMutation({
    mutationFn: ({ amount, fromCurrency, toCurrency }: { amount: number; fromCurrency: string; toCurrency?: string }) =>
      currencyApi.convert(amount, fromCurrency, toCurrency),
  });
}

// Sync live rates
export function useSyncCurrencyRates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => currencyApi.syncRates(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currency-rates'] });
    },
  });
}

// Get historical rates
export function useHistoricalCurrencyRates(fromCurrency: string, toCurrency?: string, date?: string) {
  return useQuery({
    queryKey: ['currency-rates', 'historical', fromCurrency, toCurrency || 'IDR', date],
    queryFn: () => currencyApi.getHistoricalRates(fromCurrency, toCurrency, date),
    enabled: !!fromCurrency,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Bulk upsert rates
export function useBulkUpsertCurrencyRates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rates: Array<{ from_currency: string; to_currency?: string; rate: number }>) =>
      currencyApi.bulkUpsertRates(rates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currency-rates'] });
    },
  });
}

// Get supported currencies
export function useSupportedCurrencies() {
  return useQuery({
    queryKey: ['supported-currencies'],
    queryFn: () => currencyApi.getSupportedCurrencies(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Validate currency code
export function useValidateCurrency() {
  return useMutation({
    mutationFn: (currencyCode: string) => currencyApi.validateCurrency(currencyCode),
  });
}

// Get currency info
export function useCurrencyInfo(currencyCode: string) {
  return useQuery({
    queryKey: ['currency-info', currencyCode],
    queryFn: () => currencyApi.getCurrencyInfo(currencyCode),
    enabled: !!currencyCode,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Deactivate old rates
export function useDeactivateOldCurrencyRates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (daysToKeep?: number) => currencyApi.deactivateOldRates(daysToKeep),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currency-rates'] });
    },
  });
}