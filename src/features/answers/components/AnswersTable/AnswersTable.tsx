import { Button, Flex, message, Modal, Radio, Table, TablePaginationConfig, Tag, Tooltip, Typography } from 'antd'
import { useEvaluateAnswersMutation } from '@api/api-answers'
import { Pto } from 'rtxtypes'
import { Image, TruncatedText } from '@features/system/components'
import { useEffect, useState } from 'react'
import { Link, useBlocker } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { ColumnType } from 'antd/es/table'

const UNSAVED_CHANGES_MESSAGE = 'Втратяться незбережені дані. Продовжити?'

interface AnswerTableProps {
  answers: Pto.Answers.PopulatedAnswer[]
  isLoading: boolean
  pagination: TablePaginationConfig
  tableKey: string
}

const { Text } = Typography

const AnswersTable: React.FC<AnswerTableProps> = ({ answers, isLoading, pagination, tableKey }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Pto.Answers.EvaluateAnswer[]>([])
  const [evaluateAnswers] = useEvaluateAnswersMutation()
  const [mode, setMode] = useState<'view' | 'evaluation'>('view')
  const [key, setKey] = useState(1)

  const hasUnsavedChanges = mode === 'evaluation' && selectedAnswers.length > 0

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  )

  const resetState = (resetMode: boolean = true) => {
    if (resetMode) {
      setMode('view')
    }
    setSelectedAnswers([])
  }

  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: UNSAVED_CHANGES_MESSAGE,
        okText: 'Продовжити',
        cancelText: 'Скасувати',
        onOk: () => {
          resetState()
          blocker.proceed()
        },
        onCancel: () => blocker.reset()
      })
    }
  }, [blocker])

  const handleSelectAnswer = (answerId: string, correct: boolean) => {
    setSelectedAnswers((prev) => {
      const updated = prev.filter((item) => item.answerId !== answerId)
      return [...updated, { answerId, correct }]
    })
  }

  const handleBatchUpdate = async () => {
    if (selectedAnswers.length === 0) return

    try {
      await evaluateAnswers(selectedAnswers)
        .unwrap()
        .then(() => {
          setSelectedAnswers([])
          message.success(`Результати прийняті`)
        })
    } catch (error) {
      console.error('Помилка при оновленні:', error)
    }
  }

  const getTitle = (text: string): React.ReactNode => (
    <Tooltip title={text}>
      <span className="truncate block">{text}</span>
    </Tooltip>
  )

  const columns: ColumnType<Pto.Answers.PopulatedAnswer>[] = [
    {
      title: getTitle('Точка'),
      dataIndex: ['node', 'name'],
      key: 'node.name',
      ellipsis: true,
      render: (text: string, record: Pto.Answers.PopulatedAnswer) => {
        return (
          <>
          <div className="flex items-center gap-2">
            {record.node.color && (
              <Tooltip
                title={
                  <div className="flex items-center gap-2">
                    <span>Колір:</span>
                    <Text
                      className="!text-white"
                      copyable={{
                        text: record.node.color,
                        onCopy: () => message.success('Колір скопійовано')
                      }}
                    >
                      {record.node.color}
                    </Text>
                  </div>
                }
              >
                <span
                  className="inline-block h-5 w-5 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: record.node.color }}
                />
              </Tooltip>
            )}

            <span className="font-bold">{text}</span>
          </div>
          <div>
            <p>{record.node.question}</p>
            {record.node.questionImage ? (
              <div className="mt-1">
                <Image
                  src={record.node.questionImage}
                  alt="Question image"
                  imageSize={'100px'}
                  expandable={true}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : undefined}
          </div>
          </>
        )
      }
    },
    {
      title: getTitle('Опис'),
      dataIndex: ['node', 'adminDescription'],
      key: 'node.adminDescription',
      ellipsis: true,
      render: (adminDescription: string) => adminDescription || '-'
    },
    {
      title: getTitle('Команда'),
      dataIndex: ['group', 'name'],
      key: 'group.name',
      render: (text: string, record: Pto.Answers.PopulatedAnswer) => (
        <p >
          <Link to={`${AppRoutes.groups}/${record.groupId}`}>
            <TruncatedText text={text} maxLength={12} />
          </Link>
          <br/>
          <Tag className="w-fit font-semibold" color={record.group.category?.color || 'grey'}>
            {record.group.category?.name || 'Категорія не вказана'}
          </Tag>
        </p>
      )
    },
    {
      title: getTitle('Правильна відповідь'),
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      ellipsis: true,
      render: (_: any, record: Pto.Answers.PopulatedAnswer) =>
        record.node.answerType === Pto.Nodes.AnswerType.Photo && record.node.correctAnswer ? (
          <Image
            src={record.node.correctAnswer}
            alt="Correct Answer"
            imageSize={'100px'}
            expandable={true}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          record.node.correctAnswer || '-'
        )
    },
    {
      title: getTitle('Кількість учасників'),
      ellipsis: true,
      dataIndex: ['group', 'numberOfParticipants'],
      key: 'group.numberOfParticipants'
    },
    {
      title: getTitle('Відповідь'),
      dataIndex: 'answerValue',
      key: 'answerValue',
      ellipsis: true,
      render: (_: any, record: Pto.Answers.PopulatedAnswer) => (
        <>
          {record.node.answerType === Pto.Nodes.AnswerType.Photo ? (
            <Image
              src={record.answerValue}
              alt="Answer"
              imageSize={'100px'}
              expandable={true}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            record.answerValue
          )}
          {record.userComment ? (
            <Typography.Paragraph>
              <br />
              <strong>Коментар:</strong>{' '}
              <br />
              <TruncatedText text={record.userComment} maxLength={12} />
            </Typography.Paragraph>
          ) : undefined}
        </>
      )
    },
    ...(mode === 'evaluation'
      ? [
          {
            title: getTitle('Дії'),
            dataIndex: 'actions',
            key: 'actions',
            ellipsis: true,
            render: (_: any, record: Pto.Answers.PopulatedAnswer) => (
              <Flex onClick={(e) => e.stopPropagation()}>
                <Radio.Group
                  buttonStyle={selectedAnswers.map((a) => a.answerId).includes(record.id) ? 'solid' : 'outline'}
                  className="min-w-[80px]"
                  onChange={(e) => handleSelectAnswer(record.id, e.target.value === 'true')}
                  defaultValue={record.processed ? (record.correct ? 'true' : 'false') : undefined}
                >
                  <Tooltip title="Зарахувано">
                    <Radio.Button value="true" className="font-bold">
                      +
                    </Radio.Button>
                  </Tooltip>
                  <Tooltip title="Не зараховано">
                    <Radio.Button value="false" className="font-bold">
                      -
                    </Radio.Button>
                  </Tooltip>
                </Radio.Group>
              </Flex>
            )
          }
        ]
      : [])
  ]

  return (
    <Flex vertical className="!overflow-x-auto w-full" key={tableKey}>
      <Flex justify="end">
        <div className="m-2">
          <Radio.Group className="min-w-[100px]" onChange={(e) => setMode(e.target.value)} defaultValue={mode}>
            <Radio.Button value="view">Перегляд</Radio.Button>
            <Radio.Button value="evaluation">Редагування</Radio.Button>
          </Radio.Group>
          {mode == 'evaluation' ? (
            <>
              <br />

              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  className="m-1"
                  disabled={selectedAnswers.length === 0}
                  onClick={() => {
                    setSelectedAnswers([])
                    setKey(Math.random())
                  }}
                >
                  Скасувати
                </Button>
                <Button
                  type="primary"
                  disabled={selectedAnswers.length === 0}
                  onClick={handleBatchUpdate}
                  className="m-1 w-fit"
                >
                  Готово
                </Button>{' '}
              </div>
            </>
          ) : undefined}
        </div>
      </Flex>

      <div className="mb-2">
        <p>
          Кількість відповідей: {' '}
          <strong>
          {pagination.total}
          </strong>
        </p>
      </div>

      <Table
        className="answers-table"
        key={key}
        dataSource={answers}
        columns={columns as unknown as ColumnType<Pto.Answers.PopulatedAnswer>[]}
        rowKey="id"
        loading={isLoading}
        scroll={{
          y: '65vh',
          x: true,
          scrollToFirstRowOnChange: true
        }}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            if (hasUnsavedChanges) {
              Modal.confirm({
                title: UNSAVED_CHANGES_MESSAGE,
                okText: 'Продовжити',
                cancelText: 'Скасувати',
                onOk: () => {
                  resetState(false)
                  pagination.onChange?.(page, pageSize)
                }
              })
            } else {
              pagination.onChange?.(page, pageSize)
            }
          }
        }}
        rowClassName={(record: Pto.Answers.PopulatedAnswer) => {
          if (!record.processed) return ''
          return record.correct ? 'correct-answer' : 'incorrect-answer'
        }}
      />
    </Flex>
  )
}

export default AnswersTable
