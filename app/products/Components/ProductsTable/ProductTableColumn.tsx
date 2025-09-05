import { Checkbox } from '@/components/ui/checkbox'
import { Product } from '@/fetch/getProductList/getProductListService'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { formatDateUTC } from '@/utils/format'   // 👈 new import

export const ProductTableColumn = (): ColumnDef<Product>[] => {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            // enableSorting: false,
            // enableHiding: false,
        },
        {
            accessorKey: 'id',
            header: 'ID',
            filterFn: 'numberQuery',
        },
        {
            accessorKey: 'title',
            header: 'Title',
            filterFn: 'fuzzyText',
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
            filterFn: 'includesAllTokens',
        },
        {
            accessorKey: 'category',
            header: 'Category',
            filterFn: 'includesAllTokens',
        },
        {
            accessorKey: 'price',
            header: 'Price',
            filterFn: 'numberQuery',
            cell: ({ getValue }) => `₹${getValue<number>().toFixed(2)}`,
        },
        {
            accessorKey: 'discountPercentage',
            header: 'Discount %',
            filterFn: 'numberQuery',
            cell: ({ getValue }) => `${getValue<number>().toFixed(1)}%`,
        },
        {
            accessorKey: 'rating',
            header: 'Rating',
            filterFn: 'numberQuery',
        },
        {
            accessorKey: 'stock',
            header: 'Stock',
            filterFn: 'numberQuery',
        },
        {
            accessorKey: 'availabilityStatus',
            header: 'Availability',
            filterFn: 'includesAllTokens',
        },
        {
            accessorKey: 'warrantyInformation',
            header: 'Warranty',
            filterFn: 'includesAllTokens',
        },
        {
            accessorKey: 'shippingInformation',
            header: 'Shipping',
            filterFn: 'includesAllTokens',
        },
        {
            accessorKey: 'returnPolicy',
            header: 'Return Policy',
            filterFn: 'includesAllTokens',
        },
        {
            accessorKey: 'minimumOrderQuantity',
            header: 'Min. Order Qty',
            filterFn: 'numberQuery',
        },
        {
            accessorKey: 'meta.createdAt',
            header: 'Created At',
            filterFn: 'dateQuery',
            cell: ({ getValue }) => formatDateUTC(getValue<string>()),
        },
        {
            accessorKey: 'meta.updatedAt',
            header: 'Updated At',
            filterFn: 'dateQuery',
            cell: ({ getValue }) => formatDateUTC(getValue<string>()),
        },
        {
            accessorKey: 'thumbnail',
            header: 'Thumbnail',
            enableGlobalFilter: false, // don’t waste time filtering on image URLs
            cell: ({ getValue }) => (
                <img
                    src={getValue<string>()}
                    alt="thumbnail"
                    className="h-10 w-10 object-cover rounded"
                />
            ),
        },
    ]
}
