"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";

interface LabelOption {
  label: string;
  value: string;
}

interface DataTableRowActionsProps<TData> {
  row: TData;
  labels?: LabelOption[];
  onDelete?: (task: TData) => void;
  onEdit?: (task: TData) => void;
  onLabelChange?: (task: TData, newLabel: string) => void;
}

interface DataTableRowActionsProps<TData> {
  row: TData;
  labels?: LabelOption[];
  onDelete?: (task: TData) => void;
  onEdit?: (task: TData) => void;
  onLabelChange?: (task: TData, newLabel: string) => void;
}

export function DataTableRowActions<TData extends object>({
  row,
  labels,
  onDelete,
  onEdit,
  onLabelChange,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onEdit?.(row)}>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>

        {labels && "label" in row && typeof row.label === "string" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={row.label}
                  onValueChange={(value) => onLabelChange?.(row, value)}
                >
                  {labels.map((label) => (
                    <DropdownMenuRadioItem
                      key={label.value}
                      value={label.value}
                    >
                      {label.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuItem onClick={() => onDelete?.(row)}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
