import { useEffect, useState } from 'react'
import { Form, Input, Button, Flex, message, Spin } from 'antd'
import { Pto } from 'rtxtypes'
import { ImageUpload } from '@features/system/components'
import { useGetAnswerQuery, useGiveAnswerMutation } from '@api/api-answers'

interface NodeAnswerFormProps {
  node: Pto.Nodes.NodeSmall
  answerId?: string
}

type FormValues = {
  answerValue: string
  userComment?: string
}

const AnswerInput = ({ node, answerId }: NodeAnswerFormProps) => {
  const [form] = Form.useForm()
  const [showComment, setShowComment] = useState(false)
  const [giveAnswer, { isLoading }] = useGiveAnswerMutation()
  const [isFormChanged, setIsFormChanged] = useState(false)
  const { data: answer, isLoading: isAnswerLoading } = useGetAnswerQuery(
    { id: answerId as string },
    { skip: answerId == undefined }
  )

  const onSubmit = async (values: FormValues) => {
    await giveAnswer({ answerValue: values.answerValue, userComment: values.userComment, nodeId: node.id })
      .unwrap()
      .then(() => message.success(`Відповідь для точки ${node.name} надіслана`, 20))
      .catch()
  }

  useEffect(() => {
    if (answer) {
      form.setFieldsValue({ answerValue: answer.answerValue, userComment: answer.userComment })
      setIsFormChanged(false)
      if (answer.userComment) setShowComment(true)
    } else {
      form.resetFields()
    }
  }, [answer, form])

  if (isAnswerLoading) return <Spin />

  return (
    <Form
      disabled={answer?.correct}
      form={form}
      layout="vertical"
      initialValues={{ answerValue: answer?.answerValue || '', userComment: answer?.userComment || '' }}
      onFinish={onSubmit}
      onFieldsChange={() => setIsFormChanged(true)}
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
          <ImageUpload
            initialValue={answer?.answerValue}
            onUpload={(result: string | ArrayBuffer | null) => {
              form.setFieldValue('answerValue', result)
              setIsFormChanged(true)
            }}
          />
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
        <Button type="primary" htmlType="submit" loading={isLoading} disabled={!isFormChanged}>
          {answer ? 'Змінити відповідь' : 'Відповісти'}
        </Button>
      </Flex>
    </Form>
  )
}

export default AnswerInput
