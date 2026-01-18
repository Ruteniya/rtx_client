import React from 'react'
import { Form, Input, DatePicker, Button, message, Card, Flex, Typography } from 'antd'
import { Pto } from 'rtxtypes'
import { useCreateGameMutation, useUpdateGameMutation } from '@api/api-games'
import dayjs from '@utils/dayjs-config'
import { ImageUpload } from '@features/system/components'

interface GameFormProps {
  isEditMode: boolean
  initialValues?: Pto.Games.Game
  onSuccess: () => void
}

const { Title, Text } = Typography

const GameForm: React.FC<GameFormProps> = ({ isEditMode, initialValues, onSuccess }) => {
  const [createGame] = useCreateGameMutation()
  const [updateGame] = useUpdateGameMutation()
  const [form] = Form.useForm()

  const [logoFile, setLogoFile] = React.useState<File | null>(null)

  const handleSubmit = async (values: any) => {
    const payload: Pto.Games.CreateGame & { logo: File | undefined } = {
      name: values.name,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      logo: logoFile || undefined
    }

    try {
      if (isEditMode) {
        await updateGame({ id: initialValues?.id || '', data: payload }).unwrap()
        message.success('Гра оновлена успішно')
      } else {
        await createGame(payload).unwrap()
        message.success('Гру створено успішно')
      }

      onSuccess()
    } catch {
      message.error('Сталася помилка. Спробуйте ще раз')
    }
  }

  return (
    <Card style={{ width: '100%' }}>
      <Flex vertical gap={24}>
        <Flex vertical gap={4}>
          <Title level={4} style={{ margin: 0 }}>
            {isEditMode ? 'Редагування гри' : 'Створення нової гри'}
          </Title>
          <Text type="secondary">Заповніть основну інформацію про гру</Text>
        </Flex>

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
          <Form.Item
            name="logo"
            label="Логотип гри"
            rules={[{ required: !isEditMode, message: 'Завантажте логотип гри' }]}
          >
            <Flex justify="center">
              <ImageUpload initialValue={initialValues?.logo} onUpload={(file: File | null) => setLogoFile(file)} />
            </Flex>
          </Form.Item>

          <Form.Item name="name" label="Назва гри" rules={[{ required: true, message: 'Введіть назву гри' }]}>
            <Input placeholder="Наприклад: Winter Challenge 2025" />
          </Form.Item>

          <Form.Item name="description" label="Опис">
            <Input.TextArea rows={4} placeholder="Короткий опис гри або її особливостей" />
          </Form.Item>

          <Flex gap={16}>
            <Form.Item
              name="startDate"
              label="Дата початку"
              rules={[{ required: true, message: 'Виберіть дату початку' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Дата завершення"
              rules={[{ required: true, message: 'Виберіть дату завершення' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
          </Flex>

          <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: 8 }}>
            {isEditMode ? 'Зберегти зміни' : 'Створити гру'}
          </Button>
        </Form>
      </Flex>
    </Card>
  )
}

export default GameForm
