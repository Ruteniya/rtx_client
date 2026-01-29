export const getQueryParamString = <T>(params: T) => {
  const searchParams = new URLSearchParams()

  for (const key in params) {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item.toString())) // Use key without [] for arrays
      } else {
        searchParams.append(key, value.toString()) // Regular key-value for non-array
      }
    }
  }

  return searchParams.toString()
}
