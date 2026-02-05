import { Divider, Flex, Typography } from 'antd'
import { AnswersFiltersBar, AnswersTable } from '@features/answers/components'
import { useGetAllAnswersQuery } from '@api/api-answers'
import { useGetGroupsQuery } from '@api/groups-api'
import { usePagination } from '@hooks/usePagination'
import { useQueryParams, ARRAY_DELIMITER } from '@hooks/useQueryParam'
import { Pto } from 'rtxtypes'
import { useMemo } from 'react'
import { useGetSmallNodesQuery } from '@api/api-nodes'
import { AnswersFilters, PaginationKeys } from '@features/answers/types'
import { getBooleanValue } from '@utils/get-boolean-value'

const pageKey: keyof Pto.App.Pagination = 'page'

const Answers = ({ processed }: { processed?: boolean }) => {
  const { page, size, onPageSizeChange } = usePagination()
  const { getParamArray, setParams, getParam } = useQueryParams()

  const filters: AnswersFilters = useMemo(
    () => ({
      searchText: (getParam(PaginationKeys.Search) as AnswersFilters['searchText']) || undefined,
      correct: getBooleanValue(getParam(PaginationKeys.Correct)) as AnswersFilters['correct'],
      groupIds: (getParamArray(PaginationKeys.GroupIds) as AnswersFilters['groupIds']) || undefined,
      nodeIds: (getParamArray(PaginationKeys.NodeIds) as AnswersFilters['nodeIds']) || undefined
    }),
    [
      getParam(PaginationKeys.Search),
      getParamArray(PaginationKeys.GroupIds),
      getParam(PaginationKeys.Correct),
      getParamArray(PaginationKeys.NodeIds),
      processed
    ]
  )

  const { data: answersData, isLoading: isAnswersLoading } = useGetAllAnswersQuery({
    page,
    size,
    processed,
    ...filters
  })

  const groupSearch = getParam('groupSearch') || undefined
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery(
    {page: 1, size: 20, searchText: groupSearch }
  )
  const { data: nodesData, isLoading: isNodesLoading } = useGetSmallNodesQuery()

  const answers = answersData?.items || []
  const groups = groupsData?.items || []
  const nodes = nodesData?.items || []

  const handleFiltersChange = (newFilters: AnswersFilters & { groupSearch?: string }) => {
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

  return (
    <div>
      <Typography.Title level={4}>Відповіді</Typography.Title>
      <Divider />

      <AnswersFiltersBar
        processed={processed}
        filters={filters}
        groups={groups}
        nodes={nodes}
        isLoading={isGroupsLoading || isNodesLoading}
        getSearchDefaultValue={getParam(PaginationKeys.Search) || ''}
        onChange={handleFiltersChange}
        showCorrectFilter={processed !== false}
        onGroupSearch={(value) => handleFiltersChange({ ...filters, groupSearch: value })}
        groupSearchValue={groupSearch}
      />

      <Flex justify="center" className="lg:!-mt-10">
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
