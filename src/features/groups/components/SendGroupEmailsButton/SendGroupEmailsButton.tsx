import { useSendGroupEmailsMutation } from '@api/groups-api'
import { message, Button } from 'antd'

type SendGroupEmailsButtonProps = {
  groupIds: string[]
}

const SendGroupEmailsButton = ({ groupIds }: SendGroupEmailsButtonProps) => {
  const [sendEmails, { isLoading }] = useSendGroupEmailsMutation()

  const handleSendEmails = async () => {
    if (!groupIds.length) {
      return message.error('Виберіть хоча б одну команду')
    }

    try {
      await sendEmails({ groupIds }).unwrap()
      message.success('Email надіслано групам')
    } catch (e) {
      message.error('Помилка при відправці email')
    }
  }

  return (
    <Button type="primary" disabled={!groupIds.length} loading={isLoading} onClick={handleSendEmails}>
      Відправити коди груп
    </Button>
  )
}

export default SendGroupEmailsButton
