import { Flex, Spin } from 'antd'
import { Image } from '@features/system/components'
import { useGetShortNodeQuery } from '@api/api-nodes'

type NodeProps = {
  nodeId: string
}

export default function Node({ nodeId }: NodeProps) {
  const { data: node } = useGetShortNodeQuery({ id: nodeId })
  if (!node) return <Spin />
  return (
    <>
      <p className="text-gray-800">{node.question}</p>
      {node.comment && <p className="text-sm text-gray-500">{node.comment}</p>}

      {node.questionImage ? (
        <Flex className="!m-2">
          <Image src={node.questionImage} imageSize={'90%'} expandable={true} />
        </Flex>
      ) : undefined}
    </>
  )
}
