import { Typography, Space } from 'antd'
import { Pto } from '@rtx/types'
import { LoginButton } from '@features/auth/components'

const { Title, Text } = Typography

interface GroupInfoProps {
  group: Pto.Groups.Group
}

const GroupInfo: React.FC<GroupInfoProps> = ({ group }) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title level={4}>Твоя команда:</Title>
      <Text strong>{group.name}</Text>
      {group.category ? <Text>Категорія: {group.category.name}</Text> : ''}

      <LoginButton />
    </Space>
  )
}

export default GroupInfo
