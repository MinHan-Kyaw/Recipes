import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { CustomPagination } from "./CustomPagination";

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  hidden?: boolean | string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T | ((item: T) => string);
  isLoading?: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
  renderRow?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
  indexOffset?: number;
}

export function DataTable<T extends object>({
  data,
  columns,
  keyField,
  isLoading = false,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onSort,
  renderRow,
  emptyMessage = "No items found",
  loadingMessage = "Loading...",
  indexOffset = 0,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getKey = (item: T): string => {
    if (typeof keyField === "function") {
      return keyField(item);
    }
    const key = item[keyField];
    return key ? key.toString() : "";
  };

  const getHiddenClass = (hidden?: boolean | string): string => {
    if (hidden === true) return "hidden";
    if (hidden === "md") return "hidden md:table-cell";
    if (hidden === "lg") return "hidden lg:table-cell";
    return "";
  };

  return (
    <>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">{loadingMessage}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key.toString()}
                  className={`${getHiddenClass(column.hidden)} ${
                    column.className || ""
                  }`}
                >
                  {column.sortable && onSort ? (
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => onSort(column.key.toString())}
                    >
                      {column.header}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              renderRow ? (
                data.map((item, index) => renderRow(item, index))
              ) : (
                data.map((item, index) => (
                  <TableRow key={getKey(item)}>
                    {columns.map((column) => (
                      <TableCell
                        key={`${getKey(item)}-${column.key.toString()}`}
                        className={getHiddenClass(column.hidden)}
                      >
                        {column.render
                          ? column.render(item, indexOffset + index)
                          : column.key in item
                          ? String(item[column.key as keyof T])
                          : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {data.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="justify-center mt-4"
        />
      )}
    </>
  );
}
