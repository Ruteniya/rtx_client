import { useGetShortNodesQuery } from '@api/api-nodes'
import { Card, Divider, Flex, Tabs, Tag } from 'antd'
import Node from '../Node/Node'
import { AnswerInput } from '..'
import { useGetAnswersQuery } from '@api/api-answers'
import { Pto } from '@rtx/types'
import { ReactNode } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'

const NodesTabs = () => {
  const { data } = useGetShortNodesQuery()
  const { data: answers } = useGetAnswersQuery()
  const nodes = data?.items || []

  const getTagConfig = (answer?: Pto.Answers.Answer): { text: string; color: string; icon?: ReactNode } => {
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

  const getTag = (answer?: Pto.Answers.Answer): ReactNode => {
    const config = getTagConfig(answer)
    return (
      <Tag color={config.color} icon={config.icon} className="max-h-fit">
        {config.text}
      </Tag>
    )
  }

  return (
    <Tabs
      className="nodes-tabs"
      tabPosition="left"
      items={nodes.map((node) => ({
        label: node.name,
        key: node.id,
        children: (() => {
          const answer = answers?.find((answer) => answer.nodeId === node.id)

          return (
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
              <Node node={node} />

              <Divider />
              <AnswerInput node={node} answer={answer} />
            </Card>
          )
        })()
      }))}
    />
  )
}

export default NodesTabs
