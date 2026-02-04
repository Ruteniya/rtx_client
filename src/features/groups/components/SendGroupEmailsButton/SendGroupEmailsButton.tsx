import { Button, message, Modal, Select } from 'antd'
import { useSendGroupEmailsMutation, useGetGroupsQuery } from '@api/groups-api'
import { useEffect, useState } from 'react'
import useModal from '@hooks/useModal'

const SendGroupEmailsButton = () => {
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery({ page: 1, size: 1000 })
  const [sendEmails, { isLoading }] = useSendGroupEmailsMutation()
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const [emailResult, setEmailResult] = useState<any>(null)
  const { openModal: openEmailResultModal, isVisible: isEmailResultModalVisible, closeModal: closeEmailResultModal } = useModal()


  useEffect(() => {
    setSelectedGroups(groupsData?.items.map((g) => g.id) || [])
  }, [groupsData])

  const handleSendEmails = async () => {
    if (selectedGroups.length === 0) return message.error('Виберіть хоча б одну групу')

    await sendEmails({ groupIds: selectedGroups }).unwrap().then((result) => {
        setEmailResult(result)
        openEmailResultModal()
        message.success(`Email надіслано групам`)
    }).catch((err) => {
        console.error(err)
        message.error('Помилка при відправці email')
        closeEmailResultModal()
    })

  }

  return (
    <>
        
    <div style={{ marginBottom: 16 }}>
      <Select
        className='max-w-[350px]'
        mode="multiple"
        placeholder="Виберіть групи для відправки кодів"
        style={{ minWidth: 250, marginRight: 8 }}
        value={selectedGroups}
        onChange={setSelectedGroups}
        options={groupsData?.items.map((g) => ({ label: g.name, value: g.id }))}
        loading={isGroupsLoading}
        allowClear
      />
      <Button type="primary" loading={isLoading} onClick={handleSendEmails}>
        Відправити коди груп
      </Button>
    </div>
  

<Modal
  title="Результат надсилання листів"
  open={isEmailResultModalVisible}
  onCancel={closeEmailResultModal}  
  onOk={closeEmailResultModal}
  footer={[
    <Button key="ok" type="primary" onClick={closeEmailResultModal}>
      OK
    </Button>
  ]}
>
  {!!emailResult && JSON.stringify(emailResult)}
</Modal>
</>

)
}

export default SendGroupEmailsButton
