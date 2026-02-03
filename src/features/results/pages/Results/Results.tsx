import { useGetCategoriesQuery } from '@api/api-categories'
import { useGetSmallNodesQuery } from '@api/api-nodes'
import { useGenerateResultsMutation, useGetResultsQuery } from '@api/api-results'
import { ResultsTable } from '@features/results/components'
import { usePagination } from '@hooks/usePagination'
import { ARRAY_DELIMITER, useQueryParams } from '@hooks/useQueryParam'
import { Button, Divider, Flex, message, Select, Typography } from 'antd'
import { useMemo } from 'react'
import { Pto } from 'rtxtypes'

const ALLOWED_SORT_FIELDS = ['groupName', 'totalPoints'] as const
const ALLOWED_SORT_DIRECTIONS = ['ASC', 'DESC'] as const

export type ResultsFilters = {
  sortBy?: (typeof ALLOWED_SORT_FIELDS)[number]
  sortOrder?: (typeof ALLOWED_SORT_DIRECTIONS)[number]
  categoryIds?: string[]
}

enum FilterKeys {
  SortBy = 'sortBy',
  SortOrder = 'sortOrder',
  CategoryIds = 'categoryIds'
}

const pageKey: keyof Pto.App.Pagination = 'page'

const Results = () => {
  const { page, size, onPageSizeChange } = usePagination(10)
  const { getParam, getParamArray, setParams } = useQueryParams()

  const filters: ResultsFilters = useMemo(() => {
    const sortByParam = getParam(FilterKeys.SortBy)
    const sortOrderParam = getParam(FilterKeys.SortOrder)
    const categoryIdsArr = getParamArray(FilterKeys.CategoryIds)
    return {
      sortBy:
        sortByParam && ALLOWED_SORT_FIELDS.includes(sortByParam as (typeof ALLOWED_SORT_FIELDS)[number])
          ? (sortByParam as ResultsFilters['sortBy'])
          : undefined,
      sortOrder:
        sortOrderParam && ALLOWED_SORT_DIRECTIONS.includes(sortOrderParam as (typeof ALLOWED_SORT_DIRECTIONS)[number])
          ? (sortOrderParam as ResultsFilters['sortOrder'])
          : undefined,
      categoryIds: categoryIdsArr.length > 0 ? categoryIdsArr : undefined
    }
  }, [getParam(FilterKeys.SortBy), getParam(FilterKeys.SortOrder), getParamArray(FilterKeys.CategoryIds)])

  const queryParams: Pto.Results.ResultsListQuery = useMemo(
    () => ({
      page,
      size,
      ...(filters.sortBy && ALLOWED_SORT_FIELDS.includes(filters.sortBy) ? { sortBy: filters.sortBy } : {}),
      ...(filters.sortOrder && ALLOWED_SORT_DIRECTIONS.includes(filters.sortOrder)
        ? { sortOrder: filters.sortOrder }
        : {}),
      ...(filters.categoryIds?.length ? { categoryIds: filters.categoryIds } : {})
    }),
    [page, size, filters.sortBy, filters.sortOrder, filters.categoryIds]
  )

  const [generateResults] = useGenerateResultsMutation()
  const { data: resultsData } = useGetResultsQuery(queryParams)
  const { data: nodesData } = useGetSmallNodesQuery({ page: 1, size: 1000 })
  const { data: categoriesData } = useGetCategoriesQuery()

  const results = Array.isArray(resultsData) ? resultsData : resultsData?.items ?? []
  const categories = categoriesData?.items ?? []

  const handleFiltersChange = (newFilters: ResultsFilters) => {
    setParams({
      [pageKey]: '1',
      [FilterKeys.SortBy]: newFilters.sortBy ?? '',
      [FilterKeys.SortOrder]: newFilters.sortOrder ?? '',
      [FilterKeys.CategoryIds]: newFilters.categoryIds?.length ? newFilters.categoryIds.join(ARRAY_DELIMITER) : ''
    })
  }

  const handleSortChange = (sortBy?: 'groupName' | 'totalPoints', sortOrder?: 'ASC' | 'DESC') => {
    if (sortBy == null || sortOrder == null) {
      handleFiltersChange({
        ...filters,
        sortBy: undefined,
        sortOrder: undefined
      })
    } else {
      handleFiltersChange({ ...filters, sortBy, sortOrder })
    }
  }

  const handleGenerateResults = async () => {
    await generateResults()
      .unwrap()
      .then(() => message.success('Попередні результати згенеровано'))
      .catch()
  }

  const total =
    typeof resultsData === 'object' && resultsData !== null && 'total' in resultsData
      ? (resultsData as { total: number }).total
      : results.length

  const pagination = {
    current: page,
    onChange: (p: number, pageSize: number) => onPageSizeChange(p, pageSize),
    total,
    pageSizeOptions: [1, 5, 10, 15, 20],
    pageSize: size,
    showSizeChanger: true
  }

  return (
    <>
      <Flex justify="end">
        <Button onClick={handleGenerateResults}>Генерувати результат</Button>
      </Flex>

      <Typography.Title level={4}>Проміжні результати</Typography.Title>
      <Divider />

      <Flex vertical gap={12} style={{ marginBottom: 16 }}>
        <Flex wrap="wrap" gap={8} align="center">
          <Select
            mode="multiple"
            allowClear
            placeholder="Категорії"
            style={{ minWidth: 200 }}
            value={filters.categoryIds ?? []}
            onChange={(value: string[]) =>
              handleFiltersChange({ ...filters, categoryIds: value.length ? value : undefined })
            }
            options={categories.map((cat) => ({
              label: (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: cat.color ?? 'grey' }}
                  />
                  {cat.name}
                </span>
              ),
              value: cat.id
            }))}
          />
        </Flex>
      </Flex>

      <Flex justify="center" vertical className="overflow-auto">
        {results.length > 0 || resultsData ? (
          <ResultsTable
            results={results}
            nodes={nodesData?.items || []}
            pagination={pagination}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />
        ) : (
          'Результати відсутні'
        )}
      </Flex>
    </>
  )
}

export default Results
