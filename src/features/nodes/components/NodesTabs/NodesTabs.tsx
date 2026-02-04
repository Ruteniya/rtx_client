import { useGetSmallNodesQuery } from '@api/api-nodes'
import { Button, Card, Divider, Flex, Spin, Tabs, Tag } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import Node from '../Node/Node'
import { useGetSmallAnswersQuery } from '@api/api-answers'
import { Pto } from 'rtxtypes'
import { ReactNode, useEffect, useState } from 'react'
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { AnswerInput } from '@features/answers/components'
import { usePagination } from '@hooks/usePagination'

const BREAKPOINT = 768 // md breakpoint

const SMALL_SCREEN_BREAKPOINT = 640 // sm breakpoint

const NodesTabs = () => {
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth)
  const responsiveSize = windowWidth < SMALL_SCREEN_BREAKPOINT ? 4 : windowWidth < BREAKPOINT ? 5 : 10
  const { page, size, onPageChange, onPageSizeChange } = usePagination(responsiveSize)

  // Update page size when window size changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update size when responsive size changes
  useEffect(() => {
    if (responsiveSize !== size) {
      // Reset to page 1 when size changes to avoid out-of-bounds pages
      onPageSizeChange(1, responsiveSize)
    }
  }, [responsiveSize, size, onPageSizeChange])
  const { data: smallNodesData, isLoading: isNodesLoading } = useGetSmallNodesQuery({ page, size })
  const { data: answersData } = useGetSmallAnswersQuery()
  const nodes = smallNodesData?.items || []
  const answers = answersData?.items || []
  const total = smallNodesData?.total ?? 0
  const totalPages = Math.ceil(total / size)
  const [activeTab, setActiveTab] = useState<string | undefined>(nodes[0]?.id)

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
      <span className="max-h-fit !min-w-[25px] m-1" style={{ color: config.color }}>
        {withText ? config.text : undefined}
        {config.icon}
      </span>
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    scrollToTop()
  }

  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1)
      setActiveTab(undefined) // Reset active tab when changing page
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1)
      setActiveTab(undefined) // Reset active tab when changing page
    }
  }

  // Set active tab to first node when nodes change or page changes
  useEffect(() => {
    if (nodes.length > 0 && (!activeTab || !nodes.find((n) => n.id === activeTab))) {
      setActiveTab(nodes[0].id)
    }
  }, [nodes, page])

  if (isNodesLoading) return <Spin size="large" />

  return (
    <Flex vertical gap={16}>
      {totalPages > 1 && (
        <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
          <Button
            icon={<LeftOutlined />}
            onClick={handlePrevPage}
            disabled={page === 1}
          />
          <span>
            Сторінка {page} з {totalPages}
          </span>
          <Button
            icon={<RightOutlined />}
            onClick={handleNextPage}
            disabled={page >= totalPages}
          />
        </Flex>
      )}
      <Tabs
        className="nodes-tabs"
        tabPosition="top"
        activeKey={activeTab}
        onChange={handleTabChange}
        items={nodes.map((node: Pto.Nodes.NodeSmall) => {
        const answer = answers?.find((answer) => answer.nodeId === node.id)

        return {
          label: (
            <span className="flex items-center gap-1 min-w-0">
              <span className="truncate flex-1 min-w-0">{node.name}</span>
              {answer ? getTagAsSpan(answer, false) : undefined}
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
    </Flex>
  )
}

export default NodesTabs
