export const getBooleanValue = (value?: string | null) => {
  if (value === undefined || value === null) return undefined
  const normalized = String(value).trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return undefined
}
