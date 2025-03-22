import { useGetSmallNodesQuery } from '@api/api-nodes'
import { Card, Divider, Flex, Spin, Tabs, Tag } from 'antd'
import Node from '../Node/Node'
import { useGetSmallAnswersQuery } from '@api/api-answers'
import { Pto } from 'rtxtypes'
import { ReactNode } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { AnswerInput } from '@features/answers/components'

const NodesTabs = () => {
  const { data: smallNodesData, isLoading: isNodesLoading } = useGetSmallNodesQuery()
  const { data: answersData } = useGetSmallAnswersQuery()
  const nodes = smallNodesData?.items || []
  const answers = answersData?.items || []

  const getTagConfig = (answer?: Pto.Answers.AnswerSmall): { text: string; color: string; icon?: ReactNode } => {
    if (!answer) {
      return { text: 'Не здано', color: 'default' }
    }

    if (!answer.processed) {
      return { text: 'Опрацьовується', color: 'gold', icon: <SyncOutlined /> }
    }

    if (answer.correct) {
      return { text: 'Зараховано', color: 'green', icon: <CheckCircleOutlined /> }
    }

    return { text: 'Не зараховано', color: 'volcano', icon: <CloseCircleOutlined /> }
  }

  const getTag = (answer?: Pto.Answers.AnswerSmall, withText = true): ReactNode => {
    const config = getTagConfig(answer)
    return (
      <Tag color={config.color} icon={config.icon} className="max-h-fit">
        {withText ? config.text : undefined}
      </Tag>
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
              {node.name} {answer ? getTag(answer, false) : undefined}
            </span>
          ),
          key: node.id,
          children: (
            <Card
              className="!min-w-[200px]"
              title={
                <Flex className="justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-blue-600">{node.name}</h3>
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
