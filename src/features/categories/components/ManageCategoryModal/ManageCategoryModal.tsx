import { Modal, Form, Input } from 'antd'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@api/api-categories'
import { useEffect } from 'react'

const ManageCategoryModal = ({
  categoryData,
  isVisible,
  closeModal
}: {
  categoryData?: any
  isVisible: boolean
  closeModal: () => void
}) => {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [form] = Form.useForm()

  const isEditMode = !!categoryData

  useEffect(() => {
    if (categoryData) {
      form.setFieldsValue(categoryData)
    } else {
      form.resetFields()
    }
  }, [categoryData])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (isEditMode) {
        await updateCategory({
          id: categoryData.id,
          data: { name: values.name, description: values.description, color: values.color }
        })
      } else {
        await createCategory(values)
      }
      form.resetFields()
      closeModal()
    } catch (error) {
      console.error('Failed to manage category:', error)
    }
  }

  return (
    <>
      <Modal
        title={isEditMode ? 'Редагувати категорію' : 'Додати категорію'}
        open={isVisible}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={isCreating || isUpdating}
      >
        <Form key={categoryData ? categoryData.id : 'create'} form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Назва категорії"
            rules={[{ required: true, message: 'Введіть назву категорії' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Опис" rules={[{ required: true, message: 'Введіть опис категорії' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label="Колір"
            initialValue="#ffffff"
            rules={[{ required: true, message: 'Введіть колір категорії' }]}
          >
            <Input type="color" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ManageCategoryModal
