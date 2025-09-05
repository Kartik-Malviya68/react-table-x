// utils/format.ts
export function formatDateUTC(value: string | Date | number) {
    const d = new Date(value)
    if (Number.isNaN(+d)) return ''
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    // dd/mm/yyyy — deterministic across SSR/CSR
    return `${dd}/${mm}/${yyyy}`
}
