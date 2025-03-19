import { Button, Flex, Input, message, Radio, Select, Table, Tag, Tooltip, Typography } from 'antd'
import { useEvaluateAnswersMutation, useGetAllAnswersQuery } from '@api/api-answers'
import { Pto } from '@rtx/types'
import { Image } from '@features/system/components'
import { usePagination } from '@hooks/usePagination'
import { useMemo, useState } from 'react'
import { ARRAY_DELIMITER, useQueryParams } from '@hooks/useQueryParam'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { useGetGroupsQuery } from '@api/groups-api'

export type AnswersFilters = {
  searchText?: string
  correct?: boolean
  groupIds?: string[]
}

enum PaginationKeys {
  Search = 'searchText',
  Correct = 'correct',
  GroupIds = 'groupIds'
}

const pageKey: keyof Pto.App.Pagination = 'page'

const AnswersTable = ({ processed, filters: filtersParam }: { processed?: boolean; filters?: AnswersFilters }) => {
  const { page, size, onPageSizeChange } = usePagination()
  const { getParamArray, setParams, getParam } = useQueryParams()
  const [selectedAnswers, setSelectedAnswers] = useState<Pto.Answers.EvaluateAnswer[]>([])
  const [evaluateAnswers] = useEvaluateAnswersMutation()
  const [mode, setMode] = useState<'view' | 'evaluation'>('view')
  const [key, setKey] = useState(1)

  const navigate = useNavigate()

  const filters: AnswersFilters = useMemo(
    () => ({
      searchText:
        (getParam(PaginationKeys.Search) as AnswersFilters['searchText']) || filtersParam?.searchText || undefined,
      correct:
        (Boolean(getParam(PaginationKeys.Correct)) as AnswersFilters['correct']) || filtersParam?.correct || undefined,
      groupIds:
        (getParamArray(PaginationKeys.GroupIds) as AnswersFilters['groupIds']) || filtersParam?.groupIds || undefined
    }),
    [getParam('searchText'), getParamArray('groupIds'), getParam('correct'), processed, filtersParam]
  )

  const { data, isLoading } = useGetAllAnswersQuery({ page, size, processed, ...filters })
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery()
  const groups = groupsData?.items

  const handleFiltersChange = (newFilters: AnswersFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      const currentParam = Array.isArray(value) ? getParamArray(key) : getParam(key)
      if (currentParam?.toString() !== value?.toString()) {
        setParams({ [pageKey]: '1', [key]: Array.isArray(value) ? value.join(ARRAY_DELIMITER) : value.toString() })
      }
    })
  }

  const answers = data?.items || []

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
          message.success(`${selectedAnswers.length} відповідей було перевірено`)
        })
    } catch (error) {
      console.error('Помилка при оновленні:', error)
    }
  }

  const columns = [
    {
      title: 'Точка',
      dataIndex: ['node', 'name'],
      key: 'node.name'
    },
    {
      title: 'Питання',
      dataIndex: ['node', 'question'],
      key: 'node.question',
      render: (question: string, record: Pto.Answers.PopulatedAnswer) => (
        <>
          <p>{question}</p>
          {record.node.questionImage ? (
            <div className="mt-1">
              <Image src={record.node.questionImage} alt="Question image" imageSize={'100px'} />
            </div>
          ) : undefined}
        </>
      )
    },
    {
      title: 'Опис',
      dataIndex: ['node', 'adminDescription'],
      key: 'node.adminDescription',
      render: (adminDescription: string) => adminDescription || '-'
    },
    {
      title: 'Категорія',
      dataIndex: ['group', 'category', 'name'],
      key: 'group.category.name',
      render: (name: string, record: Pto.Answers.PopulatedAnswer) => (
        <Tag className="!m-1 font-semibold" color={record.group.category?.color || 'grey'}>
          {name || 'Категорія не вказана'}
        </Tag>
      )
    },
    {
      title: 'Правильна відповідь',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      render: (_: any, record: Pto.Answers.PopulatedAnswer) =>
        record.node.answerType === Pto.Nodes.AnswerType.Photo && record.node.correctAnswer ? (
          <Image src={record.node.correctAnswer} alt="Correct Answer" imageSize={'100px'} />
        ) : (
          record.node.correctAnswer
        )
    },
    {
      title: 'Кількість учасників',
      dataIndex: ['group', 'numberOfParticipants'],
      key: 'group.numberOfParticipants'
    },
    {
      title: 'Відповідь',
      dataIndex: 'answerValue',
      key: 'answerValue',
      render: (_: any, record: Pto.Answers.PopulatedAnswer) => (
        <>
          {record.node.answerType === Pto.Nodes.AnswerType.Photo ? (
            <Image src={record.answerValue} alt="Answer" imageSize={'100px'} />
          ) : (
            record.answerValue
          )}
          {record.userComment ? (
            <Typography.Paragraph>
              <br />
              <strong>Коментар:</strong>
              {record.userComment}
            </Typography.Paragraph>
          ) : undefined}
        </>
      )
    },
    ...(mode === 'evaluation'
      ? [
          {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
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
    <Flex vertical className="!overflow-x-auto w-full">
      <Flex gap={15} align="center" wrap="wrap" justify="space-between">
        <Flex gap={2}>
          <Input.Search
            key={filters.searchText?.toString()}
            defaultValue={getParam(PaginationKeys.Search) || ''}
            placeholder={'Шукати відповідь'}
            allowClear
            onSearch={(value) => handleFiltersChange({ ...filters, searchText: value })}
            style={{ width: 250 }}
            className="[&_.ant-input-search-button]:!w-[42px]"
          />
          <Select
            key={filters.groupIds?.toString()}
            mode="multiple"
            allowClear
            placeholder="Виберіть групи"
            className="overflow-auto w-auto"
            loading={isGroupsLoading}
            defaultValue={filters?.groupIds || []}
            // value={filters?.groupIds}
            onChange={(value: string[]) => {
              handleFiltersChange({ ...filters, groupIds: value })
            }}
            style={{ width: 250 }}
            options={groups?.map((group) => ({
              label: group.name,
              value: group.id // ID групи
            }))}
          />
        </Flex>

        <div>
          <Radio.Group className="min-w-[100px]" onChange={(e) => setMode(e.target.value)} defaultValue={mode}>
            <Radio.Button value="view">Перегляд</Radio.Button>
            <Radio.Button value="evaluation">Редагування</Radio.Button>
          </Radio.Group>
          {mode == 'evaluation' ? (
            <>
              <br />

              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  className="m-2"
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
                  className="m-2 w-fit"
                >
                  Готово
                </Button>{' '}
              </div>
            </>
          ) : undefined}
        </div>
      </Flex>

      <br />

      <Table
        className="answers-table"
        key={key}
        dataSource={answers}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={{
          current: page,
          onChange: (page, pageSize) => {
            onPageSizeChange(page, pageSize)
          },
          total: data?.total || 0,
          pageSizeOptions: [2, 5, 10, 15],
          pageSize: size,
          showSizeChanger: true
        }}
        rowClassName={(record: Pto.Answers.PopulatedAnswer) => {
          if (!record.processed) return ''
          return record.correct ? 'correct-answer' : 'incorrect-answer'
        }}
        onRow={(record: Pto.Answers.PopulatedAnswer) => {
          return { onClick: () => navigate(`${AppRoutes.groups}/${record.groupId}`) }
        }}
      />
    </Flex>
  )
}

export default AnswersTable
