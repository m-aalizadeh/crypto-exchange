import React, { useState } from "react";
import { useTable, usePagination } from "react-table";
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
} from "../lib/formatters";
interface CryptocurrencyTableProps {
  data: any[];
  pageSize?: number;
}

const CryptocurrencyTable: React.FC<CryptocurrencyTableProps> = ({
  data,
  pageSize = 10,
}) => {
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "market_cap_rank",
        Cell: ({ value }: { value: number }) => (
          <span className="text-gray-500 dark:text-gray-400">{value}</span>
        ),
      },
      {
        Header: "Coin",
        accessor: "name",
        Cell: ({ row }: { row: any }) => (
          <div className="flex items-center space-x-3">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {row.original.name}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {row.original.symbol.toUpperCase()}
              </span>
            </div>
          </div>
        ),
      },
      {
        Header: "Price",
        accessor: "current_price",
        Cell: ({ value }: { value: number }) => (
          <span className="font-medium">{formatCurrency(value)}</span>
        ),
      },
      {
        Header: "24h",
        accessor: "price_change_percentage_24h",
        Cell: ({ value }: { value: number }) => (
          <span
            className={`font-medium ${
              value >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {value >= 0 ? "↑" : "↓"} {formatPercentage(Math.abs(value))}
          </span>
        ),
      },
      {
        Header: "Market Cap",
        accessor: "market_cap",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: "Volume (24h)",
        accessor: "total_volume",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: "Circulating Supply",
        accessor: "circulating_supply",
        Cell: ({ row }: { row: any }) => (
          <div>
            <div className="font-medium">
              {formatNumber(row.original.circulating_supply)}{" "}
              {row.original.symbol.toUpperCase()}
            </div>
            {row.original.max_supply && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{
                    width: `${
                      (row.original.circulating_supply /
                        row.original.max_supply) *
                      100
                    }%`,
                  }}
                />
              </div>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize: currentPageSizeState },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: currentPageSize },
    },
    usePagination
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        >
          <thead className="bg-gray-50 dark:bg-gray-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
          >
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {pageIndex * currentPageSizeState + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min((pageIndex + 1) * currentPageSizeState, data.length)}
            </span>{" "}
            of <span className="font-medium">{data.length}</span> results
          </span>

          <select
            value={currentPageSizeState}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              !canPreviousPage
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            «
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              !canPreviousPage
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            ‹
          </button>

          <div className="flex items-center space-x-1">
            {pageOptions
              .slice(
                Math.max(0, pageIndex - 2),
                Math.min(pageOptions.length, pageIndex + 3)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => gotoPage(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pageIndex === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            {pageOptions.length > 5 && pageIndex < pageOptions.length - 3 && (
              <>
                <span className="px-1">...</span>
                <button
                  onClick={() => gotoPage(pageOptions.length - 1)}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {pageOptions.length}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              !canNextPage
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            ›
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              !canNextPage
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptocurrencyTable;
