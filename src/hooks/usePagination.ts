import { useEffect, useState } from 'react'
import { useQueryParams } from './useQueryParam'
import { Pto } from '@rtx/types'

const pageKey: keyof Pto.App.Pagination = 'page'
const sizeKey: keyof Pto.App.Pagination = 'size'

export const usePagination = (defaultSize: number = 10) => {
  const { getParam, setParam, setParams } = useQueryParams()
  const [page, setPage] = useState(Number(getParam(pageKey) || 1))
  const [size, setSize] = useState(Number(getParam(sizeKey) || defaultSize))

  const onPageChange = (currentPage: number) => {
    setPage(currentPage)
    setParams({
      [pageKey]: currentPage.toString(),
      [sizeKey]: size.toString()
    })
  }

  const onSizeChange = (size: number) => {
    setSize(size)
    setParam(sizeKey, size.toString())
  }

  const resetPage = () => {
    setPage(1)
    setParam(pageKey, '1')
  }

  const onPageSizeChange = (page: number, size: number) => {
    setParams({ [pageKey]: page.toString(), [sizeKey]: size.toString() })
    setPage(page)
    setSize(size)
  }

  useEffect(() => {
    const page = getParam(pageKey)
    setPage(Number(page) || 1)
  }, [getParam(pageKey)])

  return {
    page,
    size,
    onPageChange,
    onSizeChange,
    resetPage,
    onPageSizeChange
  }
}
