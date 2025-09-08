'use client'

import * as React from 'react'
import { Table as TableType } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTableContext } from '@/app/products/Components/ProductsTable/TableContext'

type Props<TData> = {
    pageSizeOptions?: number[]
}

export default function Pagination<TData>({
    pageSizeOptions = [10, 20, 30, 40, 50],
}: Props<TData>) {
    const { table } = useTableContext();

    const pageIndex = table.getState().pagination.pageIndex
    const pageSize = table.getState().pagination.pageSize
    const pageCount = table.getPageCount()
    const canPrev = table.getCanPreviousPage()
    const canNext = table.getCanNextPage()

    // Use filtered rows if you have filtering; else table.getRowCount()
    const totalRows = table.getFilteredRowModel().rows.length
    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!canPrev}
                    aria-label="First page"
                >
                    <ChevronsLeft />
                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!canPrev}
                    aria-label="Previous page"
                >
                    <ChevronLeft />
                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!canNext}
                    aria-label="Next page"
                >
                    <ChevronRight />
                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!canNext}
                    aria-label="Last page"
                >
                    <ChevronsRight />
                </Button>

                <span className="px-2">
                    Page <strong>{pageIndex + 1}</strong> of <strong>{Math.max(pageCount, 1)}</strong>
                </span>

                <span>|</span>

                <span className="flex items-center gap-2">
                    <p className="text-nowrap">Go to page:</p>
                    <Input
                        className="w-20"
                        type="number"
                        min={1}
                        max={Math.max(pageCount, 1)}
                        defaultValue={pageIndex + 1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const value = Number((e.target as HTMLInputElement).value)
                                if (!Number.isNaN(value) && value >= 1) {
                                    table.setPageIndex(Math.min(value, pageCount) - 1)
                                }
                            }
                        }}
                        onBlur={(e) => {
                            const value = Number(e.currentTarget.value)
                            if (!Number.isNaN(value) && value >= 1) {
                                table.setPageIndex(Math.min(value, pageCount) - 1)
                            } else {
                                e.currentTarget.value = String(pageIndex + 1)
                            }
                        }}
                    />
                </span>

                <Select
                    value={String(pageSize)}
                    onValueChange={(v) => table.setPageSize(Number(v))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Rows per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Rows</SelectLabel>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <p className="text-sm text-muted-foreground">
                Showing {startRow.toLocaleString()}–{endRow.toLocaleString()} of {totalRows.toLocaleString()} rows
            </p>
        </div>
    )
}
