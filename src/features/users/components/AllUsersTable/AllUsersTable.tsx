import { Flex, Input } from 'antd'

import UsersTable from '../UsersTable'
import { useGetAllUsersQuery } from '@api/api-users'
import { usePagination } from '@hooks/usePagination'
import { useMemo } from 'react'
import { useQueryParams } from '@hooks/useQueryParam'
import { Pto } from 'rtxtypes'

export type AnswersFilters = {
  searchText?: string
}

enum PaginationKeys {
  Search = 'searchText'
}
const pageKey: keyof Pto.App.Pagination = 'page'

const AllUsersTable = () => {
  const { page, size, onPageSizeChange } = usePagination()
  const { getParamArray, setParams, getParam } = useQueryParams()
  const filters: AnswersFilters = useMemo(
    () => ({
      searchText: (getParam(PaginationKeys.Search) as AnswersFilters['searchText']) || undefined
    }),
    [getParam('searchText'), getParam('processed'), getParam('correct')]
  )
  const { data, isLoading } = useGetAllUsersQuery({ page, size, ...filters })

  const handleFiltersChange = (newFilters: AnswersFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      const currentParam = Array.isArray(value) ? getParamArray(key) : getParam(key)
      if (currentParam?.toString() !== value.toString()) {
        setParams({ [pageKey]: '1', [key]: value.toString() })
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
    <Flex vertical className="!overflow-x-auto w-full">
      <Input.Search
        defaultValue={getParam(PaginationKeys.Search) || ''}
        placeholder={'Шукати користувача'}
        allowClear
        onSearch={(value) => handleFiltersChange({ ...filters, searchText: value })}
        style={{ width: 250 }}
        className="[&_.ant-input-search-button]:!w-[42px]"
      />
      <br />
      <UsersTable users={data?.items || []} showGroup isLoading={isLoading} pagination={pagination} />
    </Flex>
  )
}

export default AllUsersTable
