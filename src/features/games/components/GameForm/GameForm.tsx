import React from 'react'
import { Form, Input, DatePicker, Button, message, Upload } from 'antd'
import { Pto } from '@rtx/types'
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
import { useCreateGameMutation, useUpdateGameMutation } from '@api/api-games'
import dayjs from '@utils/dayjs-config'

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

  // Function to handle image file selection and conversion to base64
  const handleUploadChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
      setTimeout(() => {
        console.log('info?.file["thumbUrl"] ', info?.file?.thumbUrl)
        setLogo(info?.file?.thumbUrl)
      }, 1000)
    }
  }

  const handleSubmit = async (values: any) => {
    const gameData: Pto.Games.CreateGame = {
      name: values.name,
      description: values.description,
      logo: logo,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString()
    }

    try {
      if (isEditMode) {
        await updateGame({ id: initialValues?.id || '', updateGameDto: gameData })
        message.success('Гра оновлена успішно')
      } else {
        await createGame(gameData)
        message.success('Гру створено успішно')
      }
      onSuccess()
    } catch (error) {
      message.error('Помилка при збереженні гри')
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        startDate: initialValues?.startDate ? dayjs(new Date(initialValues.startDate)) : undefined,
        endDate: initialValues?.endDate ? dayjs(new Date(initialValues.endDate)) : undefined
      }}
    >
      <Form.Item name="name" label="Назва гри" rules={[{ required: true, message: 'Введіть назву гри' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="logo" label="Логотип" rules={[{ required: true, message: 'Введіть логотип гри' }]}>
        <Upload listType="picture" onChange={handleUploadChange} maxCount={1}>
          {logo ? (
            <img src={logo} alt="Логотип" style={{ width: '100px', height: '100px' }} />
          ) : (
            <Button icon={<UploadOutlined />}>Завантажити логотип</Button>
          )}
        </Upload>
      </Form.Item>
      <Form.Item name="description" label="Опис" rules={[{ required: true, message: 'Введіть опис гри' }]}>
        <Input />
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
