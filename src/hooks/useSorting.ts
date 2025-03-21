import { useEffect, useState } from 'react'
import { useQueryParams } from './useQueryParam'
import { Pto } from 'rtxtypes'

const sortByKey: keyof Pto.App.Sorting = 'sortBy'
const sortOrderKey: keyof Pto.App.Sorting = 'sortOrder'

export const useSorting = () => {
  const { getParam, setParams, removeParams } = useQueryParams()
  const [sortBy, setSortBy] = useState<string | undefined>(getParam(sortByKey) || undefined)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>(getParam(sortOrderKey) as 'ASC' | 'DESC')

  const onSortChange = (newSortBy: string, newSortOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setParams({
      [sortByKey]: newSortBy,
      [sortOrderKey]: newSortOrder
    })
  }

  const resetSort = () => {
    setSortBy(undefined)
    setSortOrder(undefined)

    removeParams([sortByKey, sortOrderKey])
  }

  useEffect(() => {
    const currentSortBy = getParam(sortByKey) || undefined
    const currentSortOrder = getParam(sortOrderKey) || undefined
    setSortBy(currentSortBy)
    setSortOrder(currentSortOrder as 'ASC' | 'DESC')
  }, [getParam(sortByKey), getParam(sortOrderKey)])

  return {
    sortBy,
    sortOrder,
    onSortChange,
    resetSort
  }
}
