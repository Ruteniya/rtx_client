import { Modal, Form, Input, Select } from 'antd'
import { useEffect } from 'react'
import { useCreateGroupMutation, useUpdateGroupMutation } from '@api/groups-api'
import { useGetCategoriesQuery } from '@api/api-categories'
import { Pto } from '@rtx/types'

const ManageGroupsModal = ({
  groupData,
  isVisible,
  closeModal
}: {
  groupData?: Pto.Groups.Group
  isVisible: boolean
  closeModal: () => void
}) => {
  const { data: categoriesData, isLoading: isCategoriesDataLoading } = useGetCategoriesQuery()
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation()
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation()
  const [form] = Form.useForm()

  const isEditMode = !!groupData
  const categories = categoriesData?.items

  useEffect(() => {
    if (groupData) {
      form.setFieldsValue(groupData)
    } else {
      form.resetFields()
    }
  }, [groupData, form])

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as Pto.Groups.CreateGroup
      if (isEditMode) {
        await updateGroup({
          id: groupData!.id,
          data: {
            name: values.name,
            categoryId: values.categoryId,
            numberOfParticipants: Number(values.numberOfParticipants)
          }
        })
      } else {
        await createGroup({
          name: values.name,
          categoryId: values.categoryId,
          numberOfParticipants: Number(values.numberOfParticipants)
        })
      }
      form.resetFields()
      closeModal()
    } catch (error) {
      console.error('Failed to manage group:', error)
    }
  }

  return (
    <Modal
      title={isEditMode ? 'Редагувати групу' : 'Додати групу'}
      open={isVisible}
      onCancel={closeModal}
      onOk={handleSubmit}
      confirmLoading={isCreating || isUpdating}
    >
      <Form key={groupData ? groupData.id : 'create'} form={form} layout="vertical">
        <Form.Item name="name" label="Назва команди" rules={[{ required: true, message: 'Введіть назву команди' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="numberOfParticipants"
          label="Кількість учасників"
          rules={[{ required: true, message: 'Введіть кількість учасників' }]}
        >
          <Input type="number" />
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
  )
}

export default ManageGroupsModal
