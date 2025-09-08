import { Product } from '@/fetch/getProductList/getProductListService'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import Image from 'next/image'

export const ProductTableColumnsShort = (): ColumnDef<Product>[] => {
    return [
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
            accessorKey: 'price',
            header: 'Price',
            filterFn: 'numberQuery',
            cell: ({ getValue }) => `₹${getValue<number>().toFixed(2)}`,
        },
        {
            accessorKey: 'thumbnail',
            header: 'Thumbnail',
            enableGlobalFilter: false,
            cell: ({ getValue }) => (
                <Image
                    src={getValue<string>()}
                    alt="thumbnail"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover rounded"
                />
            ),
        },
    ]
}

export default ProductTableColumnsShort
