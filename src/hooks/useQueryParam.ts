import { useSearchParams } from 'react-router-dom'

export const ARRAY_DELIMITER = '|'

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Get the value of a specific parameter
  const getParam = (key: string): string | null => {
    return searchParams.get(key)
  }

  // Get the value of a specific parameter as an array
  const getParamArray = (key: string): string[] => {
    const param = searchParams.get(key)
    return param ? param.split(ARRAY_DELIMITER) : []
  }

  // Set or update a specific parameter
  const setParam = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams)
    if (Array.isArray(value)) {
      params.set(key, value.join(ARRAY_DELIMITER))
    } else {
      params.set(key, value)
    }
    setSearchParams(params)
  }

  // Set multiple parameters at once, ensuring they merge with existing ones
  const setParams = (newParams: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value.length) {
        console.log('setParams')

        if (Array.isArray(value)) {
          console.log('isarray: ', value)
          params.set(key, value.join(ARRAY_DELIMITER))
        } else {
          params.set(key, value)
        }
      } else {
        params.delete(key)
      }
    })
    setSearchParams(params)
  }

  // Remove a specific parameter
  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(key)
    setSearchParams(params)
  }

  // Remove multiple parameters
  const removeParams = (keys: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams)

    keys.forEach((key) => {
      newSearchParams.delete(key)
    })

    setSearchParams(newSearchParams)
  }

  // Clear all query parameters
  const clearParams = () => {
    setSearchParams(new URLSearchParams())
  }

  return {
    getParam,
    getParamArray,
    setParam,
    setParams,
    removeParams,
    removeParam,
    clearParams
  }
}
