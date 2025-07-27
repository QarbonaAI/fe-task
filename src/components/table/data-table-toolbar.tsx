"use client"

import { type Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "./data-table-view-options"

interface FilterOption {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: FilterOption[];
}

export function DataTableToolbar<TData>({
  table,
  filters = [],
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-end">
      <DataTableViewOptions table={table} />
    </div>
  )
}
