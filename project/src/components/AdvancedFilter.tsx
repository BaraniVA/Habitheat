import React, {useState} from "react";
import {X, Plus, Save, Trash2, Filter} from "lucide-react";
import {FilterCondition, LogicOperator, FilterPreset, Habit} from "../types";
import {
  createDefaultCondition,
  validateCondition,
  getFilterOptions,
} from "../utils/advancedFilter";

interface AdvancedFilterProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: FilterCondition[];
  globalLogicOperator: LogicOperator;
  onConditionsChange: (conditions: FilterCondition[]) => void;
  onGlobalLogicOperatorChange: (operator: LogicOperator) => void;
  presets: FilterPreset[];
  onSavePreset: (preset: Omit<FilterPreset, "id" | "createdAt">) => void;
  onLoadPreset: (preset: FilterPreset) => void;
  onDeletePreset: (presetId: string) => void;
  habits: Habit[];
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  isOpen,
  onClose,
  conditions,
  globalLogicOperator,
  onConditionsChange,
  onGlobalLogicOperatorChange,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  habits,
}) => {
  const [newPresetName, setNewPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const filterOptions = getFilterOptions(habits);

  if (!isOpen) return null;

  const addCondition = () => {
    const newCondition = createDefaultCondition();
    onConditionsChange([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    const updatedConditions = conditions.map((condition) =>
      condition.id === id ? {...condition, ...updates} : condition
    );
    onConditionsChange(updatedConditions);
  };

  const removeCondition = (id: string) => {
    const updatedConditions = conditions.filter(
      (condition) => condition.id !== id
    );
    onConditionsChange(updatedConditions);
  };

  const clearAllConditions = () => {
    onConditionsChange([]);
  };

  const savePreset = () => {
    if (!newPresetName.trim() || conditions.length === 0) return;

    const validConditions = conditions.filter(validateCondition);
    if (validConditions.length === 0) return;

    onSavePreset({
      name: newPresetName.trim(),
      conditions: validConditions,
    });

    setNewPresetName("");
    setShowPresetInput(false);
  };

  const getOperatorOptions = (type: string) => {
    switch (type) {
      case "category":
      case "priority":
      case "difficulty":
        return [
          {value: "equals", label: "Equals"},
          {value: "in", label: "Is one of"},
        ];
      case "completionRate":
      case "streak":
      case "estimatedTime":
      case "targetDays":
        return [
          {value: "equals", label: "Equals"},
          {value: "greaterThan", label: "Greater than"},
          {value: "lessThan", label: "Less than"},
          {value: "greaterThanOrEqual", label: "Greater than or equal"},
          {value: "lessThanOrEqual", label: "Less than or equal"},
        ];
      default:
        return [{value: "equals", label: "Equals"}];
    }
  };

  const getValueInput = (condition: FilterCondition) => {
    const {type, operator, value} = condition;

    if (operator === "in") {
      // Multi-select for 'in' operator
      let options: string[] = [];
      switch (type) {
        case "category":
          options = filterOptions.categories.filter((c): c is string => c !== undefined);
          break;
        case "priority":
          options = filterOptions.priorities.filter((p): p is string => p !== undefined);
          break;
        case "difficulty":
          options = filterOptions.difficulties.filter((d): d is string => d !== undefined);
          break;
      }

      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select values:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(value) ? value.includes(option) : false
                  }
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option);
                    updateCondition(condition.id, {value: newValues});
                  }}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    // Single value inputs
    switch (type) {
      case "category":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              updateCondition(condition.id, {value: e.target.value})
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select category</option>
            {filterOptions.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        );
      case "priority":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              updateCondition(condition.id, {value: e.target.value})
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select priority</option>
            {filterOptions.priorities.map((priority) => (
              <option key={priority} value={priority} className="capitalize">
                {priority}
              </option>
            ))}
          </select>
        );
      case "difficulty":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              updateCondition(condition.id, {value: e.target.value})
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select difficulty</option>
            {filterOptions.difficulties.map((difficulty) => (
              <option
                key={difficulty}
                value={difficulty}
                className="capitalize"
              >
                {difficulty}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="number"
            value={value || ""}
            onChange={(e) =>
              updateCondition(condition.id, {value: Number(e.target.value)})
            }
            placeholder="Enter value"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Filter className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Global Logic Operator */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Combine conditions with:
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => onGlobalLogicOperatorChange("AND")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  globalLogicOperator === "AND"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                AND
              </button>
              <button
                onClick={() => onGlobalLogicOperatorChange("OR")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  globalLogicOperator === "OR"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                OR
              </button>
            </div>
          </div>

          {/* Filter Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Filter Conditions
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearAllConditions}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={addCondition}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Condition</span>
                </button>
              </div>
            </div>

            {conditions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>
                  No filter conditions yet. Click "Add Condition" to get
                  started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div
                    key={condition.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Filter Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Filter by
                        </label>
                        <select
                          value={condition.type}
                          onChange={(e) =>
                            updateCondition(condition.id, {
                              type: e.target.value as any,
                              value: "", // Reset value when type changes
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="category">Category</option>
                          <option value="priority">Priority</option>
                          <option value="difficulty">Difficulty</option>
                          <option value="completionRate">
                            Completion Rate (%)
                          </option>
                          <option value="streak">Current Streak</option>
                          <option value="estimatedTime">
                            Estimated Time (min)
                          </option>
                          <option value="targetDays">
                            Target Days per Week
                          </option>
                        </select>
                      </div>

                      {/* Operator */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Condition
                        </label>
                        <select
                          value={condition.operator}
                          onChange={(e) =>
                            updateCondition(condition.id, {
                              operator: e.target.value as any,
                              value: "", // Reset value when operator changes
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {getOperatorOptions(condition.type).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Value
                        </label>
                        {getValueInput(condition)}
                      </div>

                      {/* Remove Button */}
                      <div className="flex items-end">
                        <button
                          onClick={() => removeCondition(condition.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove condition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {index < conditions.length - 1 && (
                      <div className="mt-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm font-medium">
                          {globalLogicOperator}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filter Presets
            </h3>

            {/* Save Preset */}
            <div className="flex items-center space-x-2">
              {!showPresetInput ? (
                <button
                  onClick={() => setShowPresetInput(true)}
                  disabled={conditions.length === 0}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Current Filter</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Enter preset name"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    onKeyPress={(e) => e.key === "Enter" && savePreset()}
                  />
                  <button
                    onClick={savePreset}
                    disabled={!newPresetName.trim()}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowPresetInput(false);
                      setNewPresetName("");
                    }}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Preset List */}
            {presets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {preset.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {preset.conditions.length} condition
                        {preset.conditions.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onLoadPreset(preset)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onDeletePreset(preset.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
