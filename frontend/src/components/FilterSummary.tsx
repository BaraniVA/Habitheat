import React from "react";
import {X, Filter} from "lucide-react";
import {AdvancedFilter} from "../types";
import {getCriteriaLabel} from "../utils/advancedFilter";

interface FilterSummaryProps {
  filter: AdvancedFilter;
  onClearFilter: () => void;
  className?: string;
}

export const FilterSummary: React.FC<FilterSummaryProps> = ({
  filter,
  onClearFilter,
  className = "",
}) => {
  const activeGroups = filter.groups.filter((group) => group.isActive);

  if (activeGroups.length === 0) {
    return null;
  }

  const hasMultipleGroups = activeGroups.length > 1;
  const totalCriteria = activeGroups.reduce(
    (sum, group) => sum + group.criteria.length,
    0
  );

  return (
    <div
      className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Filter className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Active Filters ({totalCriteria} criteria)
            </span>
            <button
              onClick={onClearFilter}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
              title="Clear all filters"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {activeGroups.map((group, groupIndex) => (
              <div key={group.id} className="text-sm">
                {hasMultipleGroups && (
                  <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {group.name}:
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {group.criteria.map((criteria, criteriaIndex) => (
                    <React.Fragment key={criteria.id}>
                      {criteriaIndex > 0 && (
                        <span className="text-blue-600 dark:text-blue-400 font-medium px-1">
                          {group.logicalOperator}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {getCriteriaLabel(criteria)}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                {hasMultipleGroups && groupIndex < activeGroups.length - 1 && (
                  <div className="text-center mt-2 mb-1">
                    <span className="inline-flex items-center px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                      {filter.globalOperator}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
