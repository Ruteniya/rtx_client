import { useState } from 'react'
import { Input, Button, Typography, Space } from 'antd'
import { useLazyGetGroupQuery } from '@api/groups-api'
import { Pto } from '@rtx/types'
import GroupService from '../../../../services/group.service'

const { Text } = Typography

interface GroupSelectorProps {
  setGroup: (group: Pto.Groups.Group) => void
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ setGroup }) => {
  const [groupId, setGroupId] = useState('')

  const [triggerGetGroup, { isLoading, isError }] = useLazyGetGroupQuery()

  const handleNextStep = async () => {
    const result = await triggerGetGroup(groupId)
      .unwrap()
      .catch(() => null)
    if (result) {
      setGroup(result)
      GroupService.setGroupId(result.id)
    }
  }

  return (
    <Space direction="vertical" className="w-full">
      <Text>Для реєстрації в грі введи код групи, який тобі надіслали організатори:</Text>
      <Input
        className={`${isError ? '!border-red-400' : ''}`}
        placeholder="Код групи"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <Button type="primary" onClick={handleNextStep} loading={isLoading} disabled={!groupId}>
        Далі
      </Button>
    </Space>
  )
}

export default GroupSelector
