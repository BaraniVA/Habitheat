import React, {useState, useEffect} from "react";
import {X, Plus, Trash2, Save, Filter, Clock} from "lucide-react";
import {
  AdvancedFilter,
  FilterGroup,
  FilterCriteria,
  LogicalOperator,
  SavedFilterPreset,
  FilterCriteriaType,
  FilterOperator,
} from "../types";
import {
  FILTER_CRITERIA_CONFIG,
  OPERATOR_LABELS,
  createDefaultCriteria,
  createDefaultGroup,
  generateId,
  saveFilterPreset,
  getFilterPresets,
  deleteFilterPreset,
  updatePresetLastUsed,
} from "../utils/advancedFilter";

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: AdvancedFilter;
  onApplyFilter: (filter: AdvancedFilter) => void;
  onResetFilter: () => void;
}

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  filter,
  onApplyFilter,
  onResetFilter,
}) => {
  const [currentFilter, setCurrentFilter] = useState<AdvancedFilter>(filter);
  const [presets, setPresets] = useState<SavedFilterPreset[]>([]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetDescription, setPresetDescription] = useState("");

  useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);

  useEffect(() => {
    if (isOpen) {
      setPresets(getFilterPresets());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddGroup = () => {
    const newGroup = createDefaultGroup();
    newGroup.name = `Group ${currentFilter.groups.length + 1}`;
    setCurrentFilter({
      ...currentFilter,
      groups: [...currentFilter.groups, newGroup],
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    setCurrentFilter({
      ...currentFilter,
      groups: currentFilter.groups.filter((g) => g.id !== groupId),
    });
  };

  const handleUpdateGroup = (
    groupId: string,
    updates: Partial<FilterGroup>
  ) => {
    setCurrentFilter({
      ...currentFilter,
      groups: currentFilter.groups.map((group) =>
        group.id === groupId ? {...group, ...updates} : group
      ),
    });
  };

  const handleAddCriteria = (groupId: string) => {
    const newCriteria = createDefaultCriteria();
    setCurrentFilter({
      ...currentFilter,
      groups: currentFilter.groups.map((group) =>
        group.id === groupId
          ? {...group, criteria: [...group.criteria, newCriteria]}
          : group
      ),
    });
  };

  const handleRemoveCriteria = (groupId: string, criteriaId: string) => {
    setCurrentFilter({
      ...currentFilter,
      groups: currentFilter.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              criteria: group.criteria.filter((c) => c.id !== criteriaId),
            }
          : group
      ),
    });
  };

  const handleUpdateCriteria = (
    groupId: string,
    criteriaId: string,
    updates: Partial<FilterCriteria>
  ) => {
    setCurrentFilter({
      ...currentFilter,
      groups: currentFilter.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              criteria: group.criteria.map((criteria) =>
                criteria.id === criteriaId
                  ? {...criteria, ...updates}
                  : criteria
              ),
            }
          : group
      ),
    });
  };

  const handleApply = () => {
    onApplyFilter(currentFilter);
    onClose();
  };

  const handleReset = () => {
    onResetFilter();
    onClose();
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const preset: SavedFilterPreset = {
      id: generateId(),
      name: presetName.trim(),
      description: presetDescription.trim() || undefined,
      filter: currentFilter,
      createdAt: new Date().toISOString(),
    };

    saveFilterPreset(preset);
    setPresets(getFilterPresets());
    setShowSavePreset(false);
    setPresetName("");
    setPresetDescription("");
  };

  const handleLoadPreset = (preset: SavedFilterPreset) => {
    setCurrentFilter(preset.filter);
    updatePresetLastUsed(preset.id);
    setPresets(getFilterPresets());
  };

  const handleDeletePreset = (presetId: string) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      deleteFilterPreset(presetId);
      setPresets(getFilterPresets());
    }
  };

  const getOperatorsForType = (type: FilterCriteriaType): FilterOperator[] => {
    return [...FILTER_CRITERIA_CONFIG[type].operators] as FilterOperator[];
  };

  const getValuesForType = (type: FilterCriteriaType) => {
    const config = FILTER_CRITERIA_CONFIG[type];
    return "values" in config ? config.values : [];
  };

  const renderCriteriaInput = (criteria: FilterCriteria, groupId: string) => {
    const config = FILTER_CRITERIA_CONFIG[criteria.type];

    if (config.type === "select") {
      const values = getValuesForType(criteria.type);
      return (
        <select
          value={String(criteria.value)}
          onChange={(e) =>
            handleUpdateCriteria(groupId, criteria.id, {value: e.target.value})
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {values.map((value) => (
            <option key={value} value={value}>
              {value === "completed_today"
                ? "Completed Today"
                : value === "pending_today"
                ? "Pending Today"
                : value === "missed_today"
                ? "Missed Today"
                : value === "true"
                ? "Archived"
                : value === "false"
                ? "Active"
                : value}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type="number"
          value={criteria.value}
          onChange={(e) =>
            handleUpdateCriteria(groupId, criteria.id, {
              value: Number(e.target.value),
            })
          }
          min={"min" in config ? config.min : 0}
          max={"max" in config ? config.max : undefined}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter value"
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Advanced Filters
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create powerful filter combinations with AND/OR logic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(95vh-180px)]">
          {/* Main Filter Builder */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
            {/* Global Operator */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How should filter groups be combined?
              </label>
              <div className="flex gap-3">
                {(["AND", "OR"] as LogicalOperator[]).map((op) => (
                  <button
                    key={op}
                    onClick={() =>
                      setCurrentFilter({...currentFilter, globalOperator: op})
                    }
                    className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                      currentFilter.globalOperator === op
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <span className="font-bold">{op}</span>
                    <div className="text-xs mt-1 opacity-80">
                      {op === "AND"
                        ? "All groups must match"
                        : "Any group can match"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Groups */}
            <div className="space-y-6">
              {currentFilter.groups.map((group, groupIndex) => (
                <div
                  key={group.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Group Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                          {groupIndex + 1}
                        </div>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) =>
                            handleUpdateGroup(group.id, {name: e.target.value})
                          }
                          className="text-lg font-semibold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 text-gray-900 dark:text-white focus:outline-none px-2 py-1"
                          placeholder="Group name"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                        <input
                          type="checkbox"
                          checked={group.isActive}
                          onChange={(e) =>
                            handleUpdateGroup(group.id, {
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded text-blue-500"
                        />
                        <span className="font-medium">Active</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2">
                          Combine with:
                        </span>
                        <select
                          value={group.logicalOperator}
                          onChange={(e) =>
                            handleUpdateGroup(group.id, {
                              logicalOperator: e.target
                                .value as LogicalOperator,
                            })
                          }
                          className="px-3 py-1 text-sm border-0 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                      {currentFilter.groups.length > 1 && (
                        <button
                          onClick={() => handleRemoveGroup(group.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Remove group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="space-y-4">
                    {group.criteria.map((criteria, criteriaIndex) => (
                      <div key={criteria.id} className="relative">
                        {criteriaIndex > 0 && (
                          <div className="flex items-center justify-center -mt-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-full">
                              {group.logicalOperator}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-l-4 border-blue-400">
                          {/* Criteria Type */}
                          <div className="flex-1 min-w-0">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Field
                            </label>
                            <select
                              value={criteria.type}
                              onChange={(e) => {
                                const newType = e.target
                                  .value as FilterCriteriaType;
                                const config = FILTER_CRITERIA_CONFIG[newType];
                                const defaultOperator = config
                                  .operators[0] as FilterOperator;
                                const defaultValue =
                                  config.type === "select"
                                    ? config.values[0]
                                    : 0;

                                handleUpdateCriteria(group.id, criteria.id, {
                                  type: newType,
                                  operator: defaultOperator,
                                  value: defaultValue,
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {Object.entries(FILTER_CRITERIA_CONFIG).map(
                                ([key, config]) => (
                                  <option key={key} value={key}>
                                    {config.label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          {/* Operator */}
                          <div className="flex-1 min-w-0">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Condition
                            </label>
                            <select
                              value={criteria.operator}
                              onChange={(e) =>
                                handleUpdateCriteria(group.id, criteria.id, {
                                  operator: e.target.value as FilterOperator,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {getOperatorsForType(criteria.type).map((op) => (
                                <option key={op} value={op}>
                                  {OPERATOR_LABELS[op]}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Value */}
                          <div className="flex-1 min-w-0">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Value
                            </label>
                            {renderCriteriaInput(criteria, group.id)}
                          </div>

                          {/* Remove Criteria */}
                          {group.criteria.length > 1 && (
                            <div className="flex-shrink-0">
                              <button
                                onClick={() =>
                                  handleRemoveCriteria(group.id, criteria.id)
                                }
                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors mt-6"
                                title="Remove criteria"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Criteria */}
                    <button
                      onClick={() => handleAddCriteria(group.id)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Criteria</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Group */}
            <button
              onClick={handleAddGroup}
              className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 rounded-xl transition-all border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 transform hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add New Group</span>
            </button>
          </div>

          {/* Sidebar - Presets */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Filter Presets
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Save and reuse filter combinations
                </p>
              </div>
              <button
                onClick={() => setShowSavePreset(true)}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="Save current filter as preset"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>

            {/* Save Preset Modal */}
            {showSavePreset && (
              <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">Save Preset</h4>
                <input
                  type="text"
                  placeholder="Preset name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePreset}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSavePreset(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Preset List */}
            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {preset.name}
                      </h4>
                      {preset.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {preset.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePreset(preset.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Clock className="w-3 h-3" />
                    {new Date(preset.createdAt).toLocaleDateString()}
                    {preset.lastUsed && (
                      <span>
                        • Last used{" "}
                        {new Date(preset.lastUsed).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleLoadPreset(preset)}
                    className="w-full px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                  >
                    Load Preset
                  </button>
                </div>
              ))}

              {presets.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No saved presets yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {currentFilter.groups.filter((g) => g.isActive).length}
              </span>{" "}
              active group(s)
            </div>
            {currentFilter.groups
              .filter((g) => g.isActive)
              .some((g) => g.criteria.length > 0) && (
              <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                Filter ready
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
