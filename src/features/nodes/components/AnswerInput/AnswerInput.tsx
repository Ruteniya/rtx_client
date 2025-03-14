import { useState } from 'react'
import { Form, Input, Button, Flex, message } from 'antd'
import { Pto } from '@rtx/types'
import { ImageUpload } from '@features/system/components'
import { useGiveAnswerMutation } from '@api/api-answers'

interface NodeAnswerFormProps {
  node: Pto.Nodes.ShortNode
  answer?: Pto.Answers.Answer
}

type FormValues = {
  answerValue: string
  userComment?: string
}

const NodeAnswerForm = ({ node, answer }: NodeAnswerFormProps) => {
  const [form] = Form.useForm()
  const [showComment, setShowComment] = useState(false)
  const [giveAnswer, { isLoading }] = useGiveAnswerMutation()

  const onSubmit = async (values: FormValues) => {
    console.log('values: ', values)
    await giveAnswer({ answerValue: values.answerValue, userComment: values.userComment, nodeId: node.id })
      .unwrap()
      .then(message.success(`Відповідь для точки ${node.name} надіслана`))
      .catch()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ answerValue: answer?.answerValue || '', userComment: answer?.userComment || '' }}
      onFinish={onSubmit}
    >
      {node.answerType === 'Text' && (
        <Form.Item name="answerValue" label="Відповідь" rules={[{ required: true, message: 'Введіть відповідь' }]}>
          <Input placeholder="Введіть відповідь" />
        </Form.Item>
      )}

      {node.answerType === 'Photo' && (
        <Form.Item
          className="!mb-0"
          name="answerValue"
          label="Фото-відповідь"
          rules={[{ required: true, message: 'Завантажте фото' }]}
        >
          <ImageUpload onUpload={(result: string | ArrayBuffer | null) => form.setFieldValue('answerValue', result)} />
        </Form.Item>
      )}
      <Button
        type="link"
        onClick={() => setShowComment(!showComment)}
        className={`!m-0 !p-0 ${showComment ? '!hidden' : ''}`}
      >
        Додати коментар
      </Button>

      {showComment && (
        <Form.Item className="!mt-2" name="userComment" label="Коментар">
          <Input.TextArea placeholder="Введіть коментар" maxLength={250} />
        </Form.Item>
      )}

      <Flex justify="end" className="!my-2">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {answer ? 'Змінити відповідь' : 'Відповісти'}
        </Button>
      </Flex>
    </Form>
  )
}

export default NodeAnswerForm
