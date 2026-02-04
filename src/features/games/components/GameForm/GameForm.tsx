import React from 'react'
import { Form, Input, DatePicker, Button, message, Card, Flex, Typography, Modal, Select } from 'antd'
import { Pto } from 'rtxtypes'
import { useCreateGameMutation, useDeleteGameMutation, useUpdateGameMutation } from '@api/api-games'
import dayjs from '@utils/dayjs-config'
import { ImageUpload } from '@features/system/components'
import { DeleteOutlined } from '@ant-design/icons'

interface GameFormProps {
  isEditMode: boolean
  initialValues?: Pto.Games.Game
  onSuccess: () => void
}

const { Title, Text } = Typography

const GameForm: React.FC<GameFormProps> = ({ isEditMode, initialValues, onSuccess }) => {
  const [createGame] = useCreateGameMutation()
  const [updateGame] = useUpdateGameMutation()
  const [deleteGame] = useDeleteGameMutation()
  const [form] = Form.useForm()

  const gameStatusOptions = [
    { value: Pto.Games.GameStatus.Draft, label: 'В процесі розробки' },
    { value: Pto.Games.GameStatus.Running, label: 'Активна' },
    { value: Pto.Games.GameStatus.Stopped, label: 'Зупинена' },
    { value: Pto.Games.GameStatus.Finished, label: 'Завершена' }
  ]

  const handleSubmit = async (values: any) => {
    const basePayload: Pto.Games.CreateGame & { logo: File | undefined } = {
      name: values.name,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      logo: values.logo
    }

    try {
      if (isEditMode) {
        const updatePayload: Pto.Games.UpdateGame & { logo: File | undefined } = {
          ...basePayload,
          status: values.status as Pto.Games.GameStatus
        }

        await updateGame({
          id: initialValues?.id || '',
          data: updatePayload,
          options: { deleteLogo: basePayload.logo === null }
        }).unwrap()
        message.success('Гра оновлена успішно')
      } else {
        await createGame(basePayload).unwrap()
        message.success('Гру створено успішно')
      }

      onSuccess()
    } catch {
      message.error('Сталася помилка. Спробуйте ще раз')
    }
  }

  const handleDelete = () => {
    if (!initialValues?.id) return
    Modal.confirm({
      title: 'Видалити гру?',
      content: 'Цю дію неможливо буде відмінити!',
      okText: 'Видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      onOk: async () => {
        try {
          await deleteGame({ id: initialValues.id }).unwrap()
          message.success('Гру видалено успішно')
          onSuccess()
        } catch {
          message.error('Сталася помилка при видаленні')
        }
      }
    })
  }

  return (
    <Card style={{ width: '100%' }} className="min-w-[280px]">
      <Flex vertical gap={24}>
        <Flex justify="space-between">
          <Flex vertical gap={4}>
            <Title level={4} style={{ margin: 0 }}>
              {isEditMode ? 'Редагування гри' : 'Створення нової гри'}
            </Title>
            <Text type="secondary">Заповніть основну інформацію про гру</Text>
          </Flex>

          {isEditMode && <Button danger onClick={handleDelete} icon={<DeleteOutlined />} />}
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

        <Form.Item name="logo" label="Логотип гри" preserve={false}>
          <ImageUpload
            initialValue={initialValues?.logo}
            onUpload={(file) => form.setFieldValue('logo', file)}
          />
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

          {isEditMode && (
            <Form.Item
              name="status"
              label="Статус"
              rules={[{ required: true, message: 'Оберіть статус гри' }]}
            >
              <Select placeholder="Оберіть статус" options={gameStatusOptions} />
            </Form.Item>
          )}

          <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: 8 }}>
            {isEditMode ? 'Зберегти зміни' : 'Створити гру'}
          </Button>
        </Form>
      </Flex>
    </Card>
  )
}

export default GameForm
