import { useGetCategoriesQuery } from '@api/api-categories'
import { useGetSmallNodesQuery } from '@api/api-nodes'
import { ManageNodesMenu, NodesTable } from '@features/nodes/components'
import { usePagination } from '@hooks/usePagination'
import { ARRAY_DELIMITER, useQueryParams } from '@hooks/useQueryParam'
import { Divider, Flex, Input, Select } from 'antd'
import { useMemo } from 'react'
import { Pto } from 'rtxtypes'

export type NodesFilters = {
  searchText?: string
  categoryIds?: string[]
}

enum PaginationKeys {
  Search = 'searchText',
  CategoryIds = 'categoryIds'
}

const pageKey: keyof Pto.App.Pagination = 'page'

const Nodes = () => {
  const { page, size, onPageSizeChange } = usePagination()
  const { getParam, getParamArray, setParams } = useQueryParams()
  const { data: categoriesData, isLoading: isCategoriesDataLoading } = useGetCategoriesQuery()
  const categories = categoriesData?.items || []

  const filters: NodesFilters = useMemo(
    () => ({
      searchText: (getParam(PaginationKeys.Search) as NodesFilters['searchText']) || undefined,
      categoryIds: (getParamArray(PaginationKeys.CategoryIds) as NodesFilters['categoryIds']) || undefined
    }),
    [getParam(PaginationKeys.Search), getParamArray(PaginationKeys.CategoryIds)]
  )

  const { data, isLoading } = useGetSmallNodesQuery({ page, size, ...filters })

  const handleFiltersChange = (newFilters: NodesFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      const currentParam = Array.isArray(value) ? getParamArray(key) : getParam(key)
      if (currentParam?.toString() !== value?.toString()) {
        setParams({
          [pageKey]: '1',
          [key]: Array.isArray(value) ? value.join(ARRAY_DELIMITER) : value?.toString() || ''
        })
      }
    })
  }

  const pagination = {
    current: page,
    onChange: (page: number, pageSize: number) => {
      onPageSizeChange(page, pageSize)
    },
    total: data?.total || 0,
    pageSizeOptions: [2, 5, 10, 15],
    pageSize: size,
    showSizeChanger: true
  }

  return (
    <>
      <ManageNodesMenu />
      <Divider />
      <Flex vertical className="overflow-auto w-full">
        <Flex gap={10}>
          <Input.Search
            defaultValue={getParam(PaginationKeys.Search) || ''}
            placeholder={'Шукати точку'}
            allowClear
            onSearch={(value) => handleFiltersChange({ ...filters, searchText: value })}
            style={{ width: 250 }}
            className="[&_.ant-input-search-button]:!w-[42px]"
          />
          <Select
            options={categories.map((category) => ({ label: category.name, value: category.id }))}
            placeholder="Категорії"
            allowClear
            onChange={(value: string[]) => handleFiltersChange({ ...filters, categoryIds: value })}
            loading={isCategoriesDataLoading}
            mode="multiple"
            defaultValue={filters.categoryIds}
            style={{ width: 250 }}
          />
        </Flex>

        <br />
        <NodesTable nodes={data?.items || []} isLoading={isLoading} pagination={pagination} />
      </Flex>
    </>
  )
}

export default Nodes
