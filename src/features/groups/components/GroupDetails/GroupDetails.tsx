import React from 'react'
import { Card, Tag, Typography } from 'antd'
import { Pto } from 'rtxtypes'

const { Title, Text } = Typography

interface GroupDetailsProps {
  group: Pto.Groups.Group
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group }) => {
  return (
    <Card title="Інформація про команду" style={{ width: '100%', marginBottom: 20 }} variant="borderless">
      <Title level={4}>{group.name}</Title>

      <Text strong>Кількість учасників: </Text>
      <Text>{group.numberOfParticipants}</Text>

      <br />

      <Text strong>Категорія: </Text>
      <Tag className="!m-1 font-semibold" color={group.category?.color || 'grey'}>
        {group.category?.name || 'Категорія не вказана'}
      </Tag>
    </Card>
  )
}

export default GroupDetails
