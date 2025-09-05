// types/tanstack-table.d.ts
import type { FilterFn } from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface FilterFns {
    includesAllTokens: FilterFn<any>
    fuzzyText: FilterFn<any>
    textSearch: FilterFn<any>
    numberQuery: FilterFn<any>
    dateQuery: FilterFn<any>
  }
}
