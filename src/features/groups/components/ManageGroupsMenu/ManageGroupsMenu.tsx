import { useState } from 'react'
import { Button, Dropdown, Modal, Form, Input, MenuProps, Typography, Select } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useCreateGroupMutation } from '@api/groups-api'
import { useGetCategoriesQuery } from '@api/api-categories'
import { Pto } from '@rtx/types'

const ManageGroupsMenu = () => {
  const { data: categoriesData, isLoading: isCategoriesDataLoading } = useGetCategoriesQuery()
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const categories = categoriesData?.items

  const handleAddGroup = async () => {
    try {
      const values = (await form.validateFields()) as Pto.Groups.CreateGroup
      await createGroup({
        name: values.name,
        categoryId: values.categoryId,
        numberOfParticipants: Number(values.numberOfParticipants)
      })
      form.resetFields()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to create group:', error)
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'add',
      label: 'Додати групу',
      onClick: () => setIsModalOpen(true)
    }
  ]

  return (
    <>
      <div className="flex justify-between mb-4">
        <Typography.Title>Групи</Typography.Title>
        <Dropdown menu={{ items: menuItems }}>
          <Button icon={<DownOutlined />}>Керування</Button>
        </Dropdown>
      </div>

      <Modal
        title="Додати групу"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddGroup}
        confirmLoading={isCreating}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Назва групи" rules={[{ required: true, message: 'Введіть назву групи' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="numberOfParticipants"
            label="Кількість учасників"
            rules={[{ required: true, message: 'Введіть кількість учасників' }]}
          >
            <Input type="number" value={5} />
          </Form.Item>
          <Form.Item name="categoryId" label="Категорія" rules={[{ required: true, message: 'Виберіть категорію' }]}>
            <Select loading={isCategoriesDataLoading}>
              {categories?.map((category: Pto.Categories.Category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ManageGroupsMenu
