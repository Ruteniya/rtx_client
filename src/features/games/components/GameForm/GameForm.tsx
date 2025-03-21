import React from 'react'
import { Form, Input, DatePicker, Button, message } from 'antd'
import { Pto } from 'rtxtypes'
import { useCreateGameMutation, useUpdateGameMutation } from '@api/api-games'
import dayjs from '@utils/dayjs-config'
import { ImageUpload } from '@features/system/components'

interface GameFormProps {
  isEditMode: boolean
  initialValues?: Pto.Games.Game
  onSuccess: () => void
}

const GameForm: React.FC<GameFormProps> = ({ isEditMode, initialValues, onSuccess }) => {
  const [createGame] = useCreateGameMutation()
  const [updateGame] = useUpdateGameMutation()

  const [form] = Form.useForm()
  const [logo, setLogo] = React.useState<string | undefined>(initialValues?.logo)

  const handleSubmit = async (values: any) => {
    const gameData: Pto.Games.CreateGame = {
      name: values.name,
      description: values.description,
      logo: logo,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString()
    }

    if (isEditMode) {
      await updateGame({ id: initialValues?.id || '', updateGameDto: gameData })
        .unwrap()
        .then(() => message.success('Гра оновлена успішно'))
        .catch()
    } else {
      await createGame(gameData).unwrap().then(message.success('Гру створено успішно'))
    }
    onSuccess()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        logo: { fileList: [logo] },
        startDate: initialValues?.startDate ? dayjs(new Date(initialValues.startDate)) : undefined,
        endDate: initialValues?.endDate ? dayjs(new Date(initialValues.endDate)) : undefined
      }}
    >
      <Form.Item name="name" label="Назва гри" rules={[{ required: true, message: 'Введіть назву гри' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="logo" label="Логотип" rules={[{ required: true, message: 'Введіть логотип гри' }]}>
        <ImageUpload
          initialValue={logo}
          onUpload={(result: string | ArrayBuffer | null) => setLogo(result?.toString())}
        />
      </Form.Item>
      <Form.Item name="description" label="Опис">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Дата початку"
        rules={[{ required: true, message: 'Введіть дату початку гри' }]}
      >
        <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label="Дата закінчення"
        rules={[{ required: true, message: 'Введіть дату закінчення гри' }]}
      >
        <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
        {isEditMode ? 'Оновити гру' : 'Створити гру'}
      </Button>
    </Form>
  )
}

export default GameForm
