/**
 * Хук для управления фильтрами с историей и сбросом
 */

import { useState, useCallback, useMemo } from "react";
import { countActiveFilters } from "@/types/filters";

interface UseFiltersProps<T> {
  initialFilters: T;
}

interface UseFiltersReturn<T> {
  filters: T;
  setFilters: (filters: T) => void;
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
}

export function useFilters<T extends Record<string, any>>({
  initialFilters,
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    activeFiltersCount,
    hasActiveFilters,
  };
}
