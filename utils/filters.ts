// filters.ts
import type { FilterFn, Row } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils' // ✅ 1) make sure this is installed

/** Normalize for case/diacritics-insensitive matching */
const norm = (v: unknown) =>
    String(v ?? '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()

/** Tokenize query into words */
const tokenize = (q: string) =>
    norm(q)
        .split(/[\s,]+/g)
        .filter(Boolean)

/** number parser (supports 1,234.56) */
const toNumber = (v: unknown) => {
    const s = String(v ?? '').replace(/,/g, '')
    const n = Number(s)
    return Number.isFinite(n) ? n : null
}

/** date parser (YYYY-MM-DD or anything Date parses reasonably) */
const toDate = (v: unknown) => {
    const d = new Date(String(v ?? ''))
    return Number.isNaN(+d) ? null : d
}

/** ---------- TEXT FILTERS ---------- */

/** includes all tokens across the column value (AND) */
export const includesAllTokens: FilterFn<any> = (
    row,
    columnId,
    filterValue,
    _addMeta
) => {
    const value = norm(row.getValue(columnId))
    const tokens = Array.isArray(filterValue)
        ? filterValue
        : tokenize(String(filterValue ?? ''))
    return tokens.every((t) => value.includes(t))
}

/** fuzzy text match using match-sorter-utils; falls back to includesAllTokens */
export const fuzzyText: FilterFn<any> = (
    row,
    columnId,
    filterValue,
    addMeta
) => {
    const v = norm(row.getValue(columnId))
    const q = String(filterValue ?? '').trim()
    if (!q) return true

    const rank = rankItem(v, q) // ✅ correct usage
    // expose rank via meta (useful if you later sort by match quality)
    addMeta?.({ rank })

    if (rank.passed) return true
    // Fallback: token AND includes
    return includesAllTokens(row, columnId, q, addMeta)
}

/** Global text search across all globally filterable columns */
export const textSearch: FilterFn<any> = (
    row,
    _columnId,
    filterValue,
    _addMeta
) => {
    const q = String(filterValue ?? '').trim()
    if (!q) return true
    const tokens = tokenize(q)

    const hay = row
        .getAllCells()
        .filter((cell) => cell.column.getCanGlobalFilter())
        .map((cell) => norm(cell.getValue()))
        .join(' ')

    return tokens.every((t) => hay.includes(t))
}

/** ---------- NUMBER FILTERS ---------- */
/**
 * Accepts:
 *  - exact: "42"
 *  - ops: ">10", ">=10", "<5", "<=100", "=50"
 *  - range: "10..50" (inclusive)
 */
export const numberQuery: FilterFn<any> = (
    row,
    columnId,
    filterValue,
    _addMeta
) => {
    const raw = String(filterValue ?? '').trim()
    if (!raw) return true

    const valueNum = toNumber(row.getValue(columnId))
    if (valueNum === null) return false

    // range a..b
    const rangeMatch = raw.match(/^(-?\d+(?:\.\d+)?)\.\.(-?\d+(?:\.\d+)?)$/)
    if (rangeMatch) {
        const a = Number(rangeMatch[1])
        const b = Number(rangeMatch[2])
        return valueNum >= Math.min(a, b) && valueNum <= Math.max(a, b)
    }

    // operators
    const opMatch = raw.match(/^(>=|<=|>|<|=)?\s*(-?\d+(?:\.\d+)?)$/)
    if (opMatch) {
        const [, op = '=', n] = opMatch
        const q = Number(n)
        switch (op) {
            case '>':
                return valueNum > q
            case '>=':
                return valueNum >= q
            case '<':
                return valueNum < q
            case '<=':
                return valueNum <= q
            default:
                return valueNum === q
        }
    }

    // fallback
    return includesAllTokens(row, columnId, raw, _addMeta)
}

/** ---------- DATE FILTERS ---------- */
/**
 * Accepts:
 *  - exact date: "2025-09-01" (same-day)
 *  - range: "2025-09-01..2025-09-30" (inclusive)
 */
export const dateQuery: FilterFn<any> = (
    row,
    columnId,
    filterValue,
    _addMeta
) => {
    const raw = String(filterValue ?? '').trim()
    if (!raw) return true

    const val = toDate(row.getValue(columnId))
    if (!val) return false

    // range
    const rangeMatch = raw.match(/^(.+)\.\.(.+)$/)
    if (rangeMatch) {
        const start = toDate(rangeMatch[1])
        const end = toDate(rangeMatch[2])
        if (!start || !end) return false
        const t = +val
        return t >= +start && t <= +end
    }

    // equality (same calendar day)
    const q = toDate(raw)
    if (!q) return false
    return (
        val.getFullYear() === q.getFullYear() &&
        val.getMonth() === q.getMonth() &&
        val.getDate() === q.getDate()
    )
}

/** Ready-to-use registry */
export const filterFns = {
    includesAllTokens,
    fuzzyText,
    textSearch,
    numberQuery,
    dateQuery,
} as const
