import React from 'react'
import { useGetPopulatedGroupQuery } from '@api/groups-api'
import { useNavigate, useParams } from 'react-router-dom'
import { UsersTable } from '@features/users/components'
import { Button, Divider, Flex, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import GroupDetails from '@features/groups/components/GroupDetails'

const GroupDetailsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>()
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
    </div>
  )
}

export default GroupDetailsPage
