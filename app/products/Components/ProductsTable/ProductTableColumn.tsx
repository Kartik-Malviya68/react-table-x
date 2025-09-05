import { Product } from '@/fetch/getProductList/getProductListService'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export const ProductTableColumn = (): ColumnDef<Product>[] => {
    return [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'title',
            header: 'Title',
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
        },
        {
            accessorKey: 'category',
            header: 'Category',
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ getValue }) => `₹${getValue<number>().toFixed(2)}`,
        },
        {
            accessorKey: 'discountPercentage',
            header: 'Discount %',
            cell: ({ getValue }) => `${getValue<number>().toFixed(1)}%`,
        },
        {
            accessorKey: 'rating',
            header: 'Rating',
        },
        {
            accessorKey: 'stock',
            header: 'Stock',
        },
        {
            accessorKey: 'availabilityStatus',
            header: 'Availability',
        },
        {
            accessorKey: 'warrantyInformation',
            header: 'Warranty',
        },
        {
            accessorKey: 'shippingInformation',
            header: 'Shipping',
        },
        {
            accessorKey: 'returnPolicy',
            header: 'Return Policy',
        },
        {
            accessorKey: 'minimumOrderQuantity',
            header: 'Min. Order Qty',
        },
        {
            accessorKey: 'meta.createdAt',
            header: 'Created At',
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
        },
        {
            accessorKey: 'meta.updatedAt',
            header: 'Updated At',
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
        },
        {
            accessorKey: 'thumbnail',
            header: 'Thumbnail',
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
