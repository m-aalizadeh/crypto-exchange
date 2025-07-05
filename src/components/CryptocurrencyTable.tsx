import React, { useState, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import type {
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
  Column,
  Row,
  TableState,
} from "react-table";
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
} from "../lib/formatters";

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  max_supply?: number;
  [key: string]: any;
}

interface CryptocurrencyTableProps {
  data: Cryptocurrency[];
  pageSize?: number;
}

interface TableStateWithPagination<T extends object>
  extends UsePaginationState<T> {
  pageIndex: number;
  pageSize: number;
}

interface InitialTableState extends Partial<TableState<Cryptocurrency>> {
  pageIndex: number;
  pageSize: number;
}

type TableInstanceWithPagination<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> & {
    state: TableStateWithPagination<T>;
  };

const CryptocurrencyTable: React.FC<CryptocurrencyTableProps> = ({
  data,
  pageSize = 10,
}) => {
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const columns = React.useMemo<Column<Cryptocurrency>[]>(
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
        Cell: ({ row }: { row: Row<Cryptocurrency> }) => (
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
        Cell: ({ row }: { row: Row<Cryptocurrency> }) => (
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
      data: filteredData,
      initialState: {
        pageIndex: 0,
        pageSize: currentPageSize,
      } as InitialTableState,
    },
    usePagination
  ) as TableInstanceWithPagination<Cryptocurrency>;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or symbol..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            gotoPage(0); // Reset to first page when searching
          }}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              gotoPage(0);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

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
            {page.length > 0 ? (
              page.map((row) => {
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
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No cryptocurrencies found matching your search
                </td>
              </tr>
            )}
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
              {Math.min(
                (pageIndex + 1) * currentPageSizeState,
                filteredData.length
              )}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span>{" "}
            results
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
