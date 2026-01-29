import React, { useMemo, useState } from 'react'
import { useGetPopulatedGroupQuery } from '@api/groups-api'
import { useNavigate, useParams } from 'react-router-dom'
import { UsersTable } from '@features/users/components'
import { Button, Divider, Flex, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import GroupDetails from '@features/groups/components/GroupDetails'
import { AnswersFiltersBar, AnswersTable } from '@features/answers/components'
import { useGetAllAnswersQuery } from '@api/api-answers'
import { AnswersFilters, PaginationKeys } from '@features/answers/types'
import { ARRAY_DELIMITER, useQueryParams } from '@hooks/useQueryParam'
import { useGetSmallNodesQuery } from '@api/api-nodes'
import { Pto } from 'rtxtypes'
import { getBooleanValue } from '@utils/get-boolean-value'

const pageKey: keyof Pto.App.Pagination = 'page'

const GroupDetailsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const [pagination, setPagination] = useState({ page: 1, size: 5 })

  const navigate = useNavigate()
  const { getParamArray, setParams, getParam } = useQueryParams()

  const answersFilters: AnswersFilters = useMemo(
    () => ({
      searchText: (getParam(PaginationKeys.Search) as AnswersFilters['searchText']) || undefined,
      nodeIds: (getParamArray(PaginationKeys.NodeIds) as AnswersFilters['nodeIds']) || undefined,
      correct: getBooleanValue(getParam(PaginationKeys.Correct)) as AnswersFilters['correct']
    }),
    [getParam(PaginationKeys.Search), getParam(PaginationKeys.NodeIds), getParam(PaginationKeys.Correct)]
  )

  const { data: group, isLoading } = useGetPopulatedGroupQuery(groupId as string, { skip: groupId == undefined })

  const { data: nodesData, isLoading: isNodesLoading } = useGetSmallNodesQuery()

  const { data: answersData, isLoading: isAnswersLoading } = useGetAllAnswersQuery(
    {
      ...pagination,
      ...answersFilters,
      groupIds: [groupId as string]
    },
    { skip: groupId == undefined }
  )

  const handleFiltersChange = (newFilters: AnswersFilters) => {
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
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="my-2">
        Назад
      </Button>
      <br />
      <br />
      {group ? <GroupDetails group={group} /> : ''}
      <Divider />

      <Typography.Title level={4}>Користувачі</Typography.Title>
      <Flex justify="center">
        <UsersTable users={group?.users || []} isLoading={isLoading} showGroup={false} />
      </Flex>
      <Divider />

      <Typography.Title level={4}>Відповіді</Typography.Title>

      <AnswersFiltersBar
        processed={undefined}
        filters={answersFilters}
        groups={null}
        nodes={nodesData?.items || []}
        isLoading={isNodesLoading}
        getSearchDefaultValue={getParam(PaginationKeys.Search) || ''}
        onChange={handleFiltersChange}
        showCorrectFilter={true}
      />
      <Flex justify="center">
        <AnswersTable
          answers={answersData?.items || []}
          isLoading={isAnswersLoading}
          pagination={{
            current: pagination.page,
            onChange: (page, pageSize) => {
              setPagination({ page, size: pageSize })
            },
            total: answersData?.total || 0,
            pageSizeOptions: [2, 5, 10, 15],
            pageSize: pagination.size,
            showSizeChanger: true
          }}
        />
      </Flex>
    </div>
  )
}

export default GroupDetailsPage
