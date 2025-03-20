import React, { useState } from 'react'
import { useGetPopulatedGroupQuery } from '@api/groups-api'
import { useNavigate, useParams } from 'react-router-dom'
import { UsersTable } from '@features/users/components'
import { Button, Divider, Flex, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import GroupDetails from '@features/groups/components/GroupDetails'
import { AnswersTable } from '@features/answers/components'
import { useGetAllAnswersQuery } from '@api/api-answers'

const GroupDetailsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const [pagination, setPagination] = useState({ page: 1, size: 5 })
  const { data: answersData, isLoading: isAnswersLoading } = useGetAllAnswersQuery(
    {
      ...pagination,
      groupIds: [groupId as string]
    },
    { skip: groupId == undefined }
  )

  const navigate = useNavigate()

  const { data: group, isLoading } = useGetPopulatedGroupQuery(groupId as string, { skip: groupId == undefined })

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
