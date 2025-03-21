import { Modal, Form, Input, Select, InputNumber } from 'antd'
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

  // Відстежуємо значення 'answerType' та 'questionImage' через useWatch
  const answerType = Form.useWatch('answerType', form)
  const correctAnswer = Form.useWatch('correctAnswer', form)

  useEffect(() => {
    if (nodeData) {
      form.setFieldsValue(nodeData)
    } else {
      form.resetFields()
    }
  }, [nodeData, isVisible])

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as Pto.Nodes.CreateNode
      if (isEditMode) {
        await updateNode({
          id: nodeData!.id,
          updateNodeDto: values
        })
      } else {
        await createNode(values)
      }
      form.resetFields()
      closeModal()
    } catch (error) {
      console.error('Failed to manage node:', error)
    }
  }

  const handleAnswerTypeChange = (value: Pto.Nodes.AnswerType) => {
    if (value && correctAnswer) form.setFieldValue('correctAnswer', '')
  }

  return (
    <Modal
      key={isEditMode ? `edit-${nodeData?.id}-node` : 'create-node'}
      title={isEditMode ? 'Редагувати точку' : 'Додати точку'}
      open={isVisible}
      onCancel={closeModal}
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
            onUpload={(result: string | ArrayBuffer | null) => form.setFieldValue('questionImage', result)}
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
              onUpload={(result: string | ArrayBuffer | null) => form.setFieldValue('correctAnswer', result)}
            />
          </Form.Item>
        )}
        <Form.Item name="points" label="Бали" rules={[{ required: true, message: 'Вкажіть кількість балів' }]}>
          <InputNumber step={5} min={0} placeholder="Ex. 10" className="!min-w-[150px]" />
        </Form.Item>
        <Form.Item name="adminDescription" label="Опис для адміністратора">
          <Input.TextArea placeholder="Ex. Ця точка може бути зарахована лише для категорії УПН" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ManageNodesModal
