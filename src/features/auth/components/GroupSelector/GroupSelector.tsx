import { useEffect, useState } from 'react'
import { Input, Button, Typography, Space, Divider } from 'antd'
import { useLazyGetGroupQuery } from '@api/groups-api'
import { Pto } from '@rtx/types'
import GroupService from '@services/group.service'

const { Text } = Typography

interface GroupSelectorProps {
  setGroup: (group: Pto.Groups.Group) => void
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ setGroup }) => {
  const [groupId, setGroupId] = useState('')

  const [triggerGetGroup, { isLoading, isError }] = useLazyGetGroupQuery()

  const [existingGroup, setExistingGroup] = useState<Pto.Groups.Group>()
  const existingGroupId = GroupService.getGroupId()

  useEffect(() => {
    const fetchGroup = async () => {
      if (existingGroupId) {
        try {
          const result = await triggerGetGroup(existingGroupId).unwrap()
          if (result) setExistingGroup(result)
        } catch (error) {
          console.error('Error fetching group:', error)
        }
      }
    }

    fetchGroup()
  }, [existingGroupId])

  const useExistingGroup = async () => {
    if (!existingGroup) return
    setGroupId(existingGroup?.id)
  }

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
      <Text>Введи код команди, який тобі надіслали організатори:</Text>
      <Input
        className={`${isError ? '!border-red-400' : ''}`}
        placeholder="Код групи"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      {existingGroup ? (
        <>
          <Divider className="text-xs">або</Divider>
          <Button type="dashed" onClick={useExistingGroup}>
            Використати код команди {existingGroup.name}
          </Button>
        </>
      ) : (
        <></>
      )}

      <Button type="primary" onClick={handleNextStep} loading={isLoading} disabled={!groupId}>
        Далі
      </Button>
    </Space>
  )
}

export default GroupSelector
