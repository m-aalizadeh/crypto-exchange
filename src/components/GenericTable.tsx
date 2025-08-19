import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

type ColumnDefinition<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
  render?: (value: T[K], row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
};

type TableProps<T, K extends keyof T> = {
  data: T[];
  columns: ColumnDefinition<T, K>[];
  defaultSort?: {
    key: K;
    direction: "asc" | "desc";
  };
  pageSize?: number;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyState?: React.ReactNode;
  rowClassName?: (item: T) => string;
  headerClassName?: string;
  bodyClassName?: string;
};

const GenericTable = <T, K extends keyof T>({
  data,
  columns,
  defaultSort,
  pageSize = 10,
  onRowClick,
  className = "",
  emptyState = (
    <div className="py-4 text-center text-gray-500">No data available</div>
  ),
  rowClassName,
  headerClassName = "bg-gray-50",
  bodyClassName = "bg-white",
}: TableProps<T, K>) => {
  const { t } = useTranslation("translation");
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const requestSort = (key: K) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-eft";
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className={headerClassName}>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key as string}
                      scope="col"
                      className={`px-3 py-3.5 text-sm font-semibold text-gray-900 ${
                        column.sortable
                          ? "cursor-pointer hover:bg-gray-100"
                          : ""
                      } ${getAlignmentClass(column.align)}`}
                      style={{
                        width: column.width ? `${column.width}px` : "auto",
                      }}
                      onClick={() => requestSort(column.key)}
                    >
                      <div
                        className={`flex items-center ${
                          column.align === "right"
                            ? "justify-end"
                            : column.align === "center"
                            ? "justify-center"
                            : ""
                        }`}
                      >
                        {t(column.header)}
                        {column.sortable && (
                          <span className="ml-1">
                            {sortConfig?.key === column.key
                              ? sortConfig.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${bodyClassName}`}>
                {paginatedData.length ? (
                  paginatedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`hover:bg-gray-50 ${
                        onRowClick ? "cursor-pointer" : ""
                      } ${rowClassName ? rowClassName(row) : ""}`}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key as string}
                          className={`whitespace-nowrap px-3 py-4 text-sm ${getAlignmentClass(
                            column.align
                          )} ${
                            typeof row[column.key] === "number"
                              ? "font-mono"
                              : ""
                          }`}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key] !== null &&
                              row[column.key] !== undefined
                            ? String(row[column.key])
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-4">
                      {emptyState || (
                        <div className="py-4 text-center text-gray-500">
                          {t("No data available")}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {t("Showing")} {`  `}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>
            {` `}
            {t("to")} {` `}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>
            {` `}
            {t("of")}
            <span className="font-medium">{sortedData.length}</span>
            {t("results")}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50  "
            >
              {t("Previous")}
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              if (totalPages <= 5) return i + 1;
              if (currentPage <= 3) return i + 1;
              if (currentPage >= totalPages - 2) return totalPages - 4 + i;
              return currentPage - 2 + i;
            }).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-3 py-1 text-sm">...</span>
            )}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericTable;
