import React from "react";

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  t: (key: string) => string;
  renderActions?: (item: T) => React.ReactNode;
}

const Table = <T extends {}>({
  headers,
  data,
  renderRow,
  t,
  renderActions,
}: TableProps<T>) => {
  return (
    <table className="w-full border-collapse my-5 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          {headers.map((header, index) => (
            <th
              key={index}
              className="border border-gray-300 dark:border-gray-600 p-2 text-left"
            >
              {t(header)}
            </th>
          ))}
          {renderActions && (
            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
              {t("Actions")}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-gray-300 dark:border-gray-600"
          >
            {renderRow(item)}
            {renderActions && (
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                {renderActions(item)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
