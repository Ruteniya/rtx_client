import { useEffect, useState } from 'react'
import { Input, Button, Typography, Space, Divider, message } from 'antd'
import { useLazyGetGroupQuery } from '@api/groups-api'
import { Pto } from 'rtxtypes'
import { StorageKey, StorageService } from '@services/group.service'
import { validate as validateUuid } from 'uuid'

const { Text } = Typography

interface GroupSelectorProps {
  setGroup: (group: Pto.Groups.Group) => void
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ setGroup }) => {
  const [groupId, setGroupId] = useState('')
  const [isError, setIsError] = useState(false)

  const [triggerGetGroup, { isLoading, isError: getGroupError }] = useLazyGetGroupQuery()

  const [existingGroup, setExistingGroup] = useState<Pto.Groups.Group>()
  const existingGroupId = StorageService.getItem(StorageKey.GroupId)

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
    if (!validateUuid(groupId)) {
      setIsError(true)
      message.error('Код невалідний')
      return
    } else setIsError(false)

    const result = await triggerGetGroup(groupId)
      .unwrap()
      .catch(() => null)
    if (result) {
      setGroup(result)
      StorageService.setItem(StorageKey.GroupId, result.id)
    }
  }

  return (
    <Space direction="vertical" className="w-full">
      <Text>Введи код команди, який тобі надіслали організатори:</Text>
      <Input
        className={`${isError || getGroupError ? '!border-red-400' : ''}`}
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

      <Button type="primary" onClick={handleNextStep} loading={isLoading} disabled={!groupId} className="!mt-2">
        Далі
      </Button>
    </Space>
  )
}

export default GroupSelector
