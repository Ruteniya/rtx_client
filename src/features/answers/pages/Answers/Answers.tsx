import { Flex, Input, Select } from 'antd'
import { AnswersTable } from '@features/answers/components'
import { useGetAllAnswersQuery } from '@api/api-answers'
import { useGetGroupsQuery } from '@api/groups-api'
import { AnswersFilters } from '@features/answers/components/AnswersTable/AnswersTable'
import { usePagination } from '@hooks/usePagination'
import { useQueryParams, ARRAY_DELIMITER } from '@hooks/useQueryParam'
import { Pto } from 'rtxtypes'
import { useMemo } from 'react'

enum PaginationKeys {
  Search = 'searchText',
  Correct = 'correct',
  GroupIds = 'groupIds'
}

const pageKey: keyof Pto.App.Pagination = 'page'

const Answers = ({ processed }: { processed?: boolean }) => {
  const { page, size, onPageSizeChange } = usePagination()
  const { getParamArray, setParams, getParam } = useQueryParams()

  const filters: AnswersFilters = useMemo(
    () => ({
      searchText: (getParam(PaginationKeys.Search) as AnswersFilters['searchText']) || undefined,
      correct: (Boolean(getParam(PaginationKeys.Correct)) as AnswersFilters['correct']) || undefined,
      groupIds: (getParamArray(PaginationKeys.GroupIds) as AnswersFilters['groupIds']) || undefined
    }),
    [
      getParam(PaginationKeys.Search),
      getParamArray(PaginationKeys.GroupIds),
      getParam(PaginationKeys.Correct),
      processed
    ]
  )

  const { data: answersData, isLoading: isAnswersLoading } = useGetAllAnswersQuery({
    page,
    size,
    processed,
    ...filters
  })
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery()
  const groups = groupsData?.items
  const answers = answersData?.items || []

  const handleFiltersChange = (newFilters: AnswersFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      const currentParam = Array.isArray(value) ? getParamArray(key) : getParam(key)
      if (currentParam?.toString() !== value?.toString()) {
        setParams({ [pageKey]: '1', [key]: Array.isArray(value) ? value.join(ARRAY_DELIMITER) : value.toString() })
      }
    })
  }

  return (
    <div>
      <Flex gap={15} align="center" wrap="wrap" justify="space-between">
        <Flex gap={2} wrap>
          <Input.Search
            key={filters.searchText?.toString()}
            defaultValue={getParam(PaginationKeys.Search) || ''}
            placeholder={'Шукати відповідь'}
            allowClear
            onSearch={(value) => handleFiltersChange({ ...filters, searchText: value })}
            style={{ width: 250 }}
            className="[&_.ant-input-search-button]:!w-[42px]"
          />

          <Select
            key={filters.groupIds?.toString()}
            mode="multiple"
            allowClear
            placeholder="Виберіть групи"
            className="overflow-auto w-auto"
            loading={isGroupsLoading}
            defaultValue={filters?.groupIds || []}
            onChange={(value: string[]) => {
              handleFiltersChange({ ...filters, groupIds: value })
            }}
            style={{ width: 250 }}
            options={groups?.map((group) => ({
              label: group.name,
              value: group.id // ID групи
            }))}
          />
        </Flex>
      </Flex>
      <Flex justify="center">
        <AnswersTable
          isLoading={isAnswersLoading}
          answers={answers}
          pagination={{
            current: page,
            onChange: (page, pageSize) => {
              onPageSizeChange(page, pageSize)
            },
            total: answersData?.total || 0,
            pageSizeOptions: [2, 5, 10, 15],
            pageSize: size,
            showSizeChanger: true
          }}
        />
      </Flex>
    </div>
  )
}

export default Answers
