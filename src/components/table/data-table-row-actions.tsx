"use client";

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: TData;
  onDelete?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onView?: (row: TData) => void;
}

export function DataTableRowActions<TData>({
  row,
  onDelete,
  onEdit,
  onView,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
        {onView && (
          <DropdownMenuItem 
            onClick={() => onView(row)}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem 
            onClick={() => onEdit(row)}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {(onView || onEdit) && onDelete && (
          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(row)}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
