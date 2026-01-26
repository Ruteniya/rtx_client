import { Modal, Form, Input, Select, InputNumber, message, Button } from 'antd'
import { useEffect } from 'react'
import { Pto } from 'rtxtypes'
import { useCreateNodeMutation, useUpdateNodeMutation } from '@api/api-nodes'
import { ImageUpload } from '@features/system/components'

const ManageNodesModal = ({
  nodeData,
  isVisible,
  closeModal
}: {
  nodeData?: Pto.Nodes.Node
  isVisible: boolean
  closeModal: () => void
}) => {
  const [createNode, { isLoading: isCreating }] = useCreateNodeMutation()
  const [updateNode, { isLoading: isUpdating }] = useUpdateNodeMutation()
  const [form] = Form.useForm()
  const isEditMode = !!nodeData

  const answerType = Form.useWatch('answerType', form)

  useEffect(() => {
    if (nodeData) {
      form.setFieldsValue(nodeData)
    } else {
      form.resetFields()
    }
  }, [nodeData, isVisible])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (isEditMode && nodeData?.id) {
        await updateNode({
          id: nodeData.id,
          updateNodeDto: values,
          options: {
            deleteQuestionImage: values.questionImage === null,
            deleteCorrectAnswerImage: values.correctAnswer === null
          }
        }).unwrap()
        message.success('Точку оновлено успішно')
      } else {
        await createNode(values).unwrap()
        message.success('Точку створено успішно')
      }

      form.resetFields()
      closeModal()
    } catch (error) {
      console.error('Failed to manage node:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    closeModal()
  }

  const handleAnswerTypeChange = (value: Pto.Nodes.AnswerType) => {
    if (value) form.setFieldValue('correctAnswer', '')
  }

  return (
    <Modal
      key={isEditMode ? `edit-${nodeData?.id}-node` : 'create-node'}
      title={isEditMode ? 'Редагувати точку' : 'Додати точку'}
      open={isVisible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={isCreating || isUpdating}
      okText={isEditMode ? 'Готово' : 'Додати'}
      cancelText="Скасувати"
    >
      <Form key={nodeData ? nodeData.id : 'create'} form={form} layout="vertical">
        <Form.Item name="name" label="Назва точки" rules={[{ required: true, message: 'Введіть назву точки' }]}>
          <Input placeholder="Ex. А1" maxLength={5} />
        </Form.Item>

        <Form.Item name="question" label="Питання" rules={[{ required: true, message: 'Введіть питання' }]}>
          <Input.TextArea placeholder="Ex. Сфотографуйтесь біля цієї будівлі" />
        </Form.Item>

        <Form.Item name="questionImage" label="Зображення (додаток до питання)">
          <ImageUpload
            initialValue={nodeData?.questionImage}
            onUpload={(file) => form.setFieldValue('questionImage', file)}
          />
        </Form.Item>

        <Form.Item name="comment" label="Коментар">
          <Input.TextArea placeholder="Ex. Ця будівля була збудована у ..." />
        </Form.Item>

        <Form.Item
          name="answerType"
          label="Тип відповіді команди"
          rules={[{ required: true, message: 'Оберіть тип відповіді' }]}
        >
          <Select placeholder={'Текст чи Фото'} onChange={handleAnswerTypeChange}>
            <Select.Option value={Pto.Nodes.AnswerType.Text}>Текст</Select.Option>
            <Select.Option value={Pto.Nodes.AnswerType.Photo}>Фото</Select.Option>
          </Select>
        </Form.Item>

        {answerType === Pto.Nodes.AnswerType.Text && (
          <Form.Item name="correctAnswer" label="Правильна відповідь">
            <Input />
          </Form.Item>
        )}

        {answerType === Pto.Nodes.AnswerType.Photo && (
          <Form.Item name="correctAnswer" label="Правильна відповідь (зображення)">
            <ImageUpload
              initialValue={nodeData?.correctAnswer}
              onUpload={(file) => form.setFieldValue('correctAnswer', file)}
            />
          </Form.Item>
        )}

        <Form.Item label="Бали" required>
          <Form.Item
            name="points"
            noStyle
            initialValue={10} // default value
            rules={[{ required: true, message: 'Вкажіть кількість балів' }]}
          >
            <InputNumber step={5} min={0} placeholder="Ex. 10" className="!min-w-[100px]" />
          </Form.Item>

          <div className="flex gap-1 mt-2">
            {[5, 10, 15].map((val) => (
              <Button
                key={val}
                type="dashed"
                size="middle"
                className="!font-bold"
                onClick={() => form.setFieldValue('points', val)}
              >
                {val}
              </Button>
            ))}
          </div>
        </Form.Item>

        <Form.Item name="adminDescription" label="Опис для адміністратора">
          <Input.TextArea placeholder="Ex. Ця точка може бути зарахована лише для категорії УПН" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ManageNodesModal
