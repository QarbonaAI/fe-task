import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import type { Product } from "@/api/index";

export function columns({ onEdit, onDelete }: { onEdit: (product: Product) => void; onDelete: (id: number) => void; }) {
  return [
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
      cell: ({ row }: any) => (
        <a href={`/products/${row.original.id}`} className="text-blue-600 underline">
          {row.original.title}
        </a>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      enableSorting: true,
    },
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <DataTableRowActions
          row={row.original}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.id)}
        />
      ),
    },
  ];
}