import {useState, useEffect} from "react";
import {
  FilterCondition,
  LogicOperator,
  FilterPreset,
  AdvancedFilterState,
} from "../types";

const STORAGE_KEY = "habitheat-advanced-filters";

export const useAdvancedFilter = () => {
  const [filterState, setFilterState] = useState<AdvancedFilterState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse saved filter state:", error);
      }
    }
    return {
      conditions: [],
      globalLogicOperator: "AND",
      presets: [],
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filterState));
  }, [filterState]);

  const updateConditions = (conditions: FilterCondition[]) => {
    setFilterState((prev) => ({...prev, conditions}));
  };

  const updateGlobalLogicOperator = (operator: LogicOperator) => {
    setFilterState((prev) => ({...prev, globalLogicOperator: operator}));
  };

  const savePreset = (preset: Omit<FilterPreset, "id" | "createdAt">) => {
    const newPreset: FilterPreset = {
      ...preset,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    setFilterState((prev) => ({
      ...prev,
      presets: [...prev.presets, newPreset],
    }));
  };

  const loadPreset = (preset: FilterPreset) => {
    setFilterState((prev) => ({
      ...prev,
      conditions: [...preset.conditions],
      globalLogicOperator: "AND", // Reset to default
    }));
  };

  const deletePreset = (presetId: string) => {
    setFilterState((prev) => ({
      ...prev,
      presets: prev.presets.filter((p) => p.id !== presetId),
    }));
  };

  const clearFilters = () => {
    setFilterState((prev) => ({
      ...prev,
      conditions: [],
    }));
  };

  const hasActiveFilters = filterState.conditions.length > 0;

  return {
    conditions: filterState.conditions,
    globalLogicOperator: filterState.globalLogicOperator,
    presets: filterState.presets,
    updateConditions,
    updateGlobalLogicOperator,
    savePreset,
    loadPreset,
    deletePreset,
    clearFilters,
    hasActiveFilters,
  };
};
