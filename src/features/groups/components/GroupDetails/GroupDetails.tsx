import React from 'react'
import { Card, Typography } from 'antd'
import { Pto } from '@rtx/types'

const { Title, Text } = Typography

interface GroupDetailsProps {
  group: Pto.Groups.Group
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group }) => {
  return (
    <Card title="Інформація про групу" style={{ width: '100%', marginBottom: 20 }} variant="borderless">
      <Title level={4}>{group.name}</Title>

      <Text strong>Кількість учасників: </Text>
      <Text>{group.numberOfParticipants}</Text>

      <br />

      <Text strong>Категорія: </Text>
      <Text>{group.category?.name || 'Категорія не вказана'}</Text>
    </Card>
  )
}

export default GroupDetails
