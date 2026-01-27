import { useGetSmallNodesQuery } from '@api/api-nodes'
import { Card, Divider, Flex, Spin, Tabs, Tag } from 'antd'
import Node from '../Node/Node'
import { useGetSmallAnswersQuery } from '@api/api-answers'
import { Pto } from 'rtxtypes'
import { ReactNode } from 'react'
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { AnswerInput } from '@features/answers/components'

const NodesTabs = () => {
  const { data: smallNodesData, isLoading: isNodesLoading } = useGetSmallNodesQuery({ page: 1, size: 1000 })
  const { data: answersData } = useGetSmallAnswersQuery()
  const nodes = smallNodesData?.items || []
  const answers = answersData?.items || []

  const getTagConfig = (
    answer?: Pto.Answers.AnswerSmall,
    iconType: 'outlined' | 'filled' = 'outlined'
  ): { text: string; color: string; icon?: ReactNode } => {
    if (!answer) {
      return { text: 'Не здано', color: 'default' }
    }

    if (!answer.processed) {
      return {
        text: 'Опрацьовується',
        color: 'darkgoldenrod',
        icon: <SyncOutlined />
      }
    }

    if (answer.correct) {
      return {
        text: 'Зараховано',
        color: 'green',
        icon: iconType === 'outlined' ? <CheckCircleOutlined /> : <CheckCircleFilled />
      }
    }

    return {
      text: 'Не зараховано',
      color: 'volcano',
      icon: iconType === 'outlined' ? <CloseCircleOutlined /> : <CloseCircleFilled />
    }
  }

  const getTag = (answer?: Pto.Answers.AnswerSmall, withText = true): ReactNode => {
    const config = getTagConfig(answer)
    return (
      <Tag color={config.color} icon={config.icon} className="max-h-fit">
        {withText ? config.text : undefined}
      </Tag>
    )
  }

  const getTagAsSpan = (answer?: Pto.Answers.AnswerSmall, withText = true): ReactNode => {
    const config = getTagConfig(answer, 'outlined')
    return (
      <span className="max-h-fit !min-w-[25px]" style={{ color: config.color }}>
        {withText ? config.text : undefined}
        {config.icon}
      </span>
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  if (isNodesLoading) return <Spin size="large" />

  return (
    <Tabs
      className="nodes-tabs"
      tabPosition="left"
      onChange={scrollToTop}
      items={nodes.map((node: Pto.Nodes.NodeSmall) => {
        const answer = answers?.find((answer) => answer.nodeId === node.id)

        return {
          label: (
            <span>
              {node.name} {answer ? getTagAsSpan(answer, false) : undefined}
            </span>
          ),
          key: node.id,
          children: (
            <Card
              className="!min-w-[200px]"
              title={
                <Flex className="justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {node.color && (
                        <span
                          className="inline-block h-5 w-5 rounded-full border border-gray-300 cursor-pointer shrink-0"
                          style={{ backgroundColor: node.color }}
                        />
                      )}

                      <h3 className="text-lg font-semibold truncate">{node.name}</h3>
                    </div>
                  </div>

                  {getTag(answer)}
                </Flex>
              }
            >
              <Node nodeId={node.id} />

              <Divider />
              <AnswerInput node={node} answerId={answer?.id || undefined} />
            </Card>
          )
        }
      })}
    />
  )
}

export default NodesTabs
