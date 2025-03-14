import { Pto } from '@rtx/types'
import NodeImage from '../NodeImage'
import { Flex, Typography } from 'antd'

type NodeProps = {
  node: Pto.Nodes.Node
}

export default function Node({ node }: NodeProps) {
  return (
    <>
      {/* <h3 className="text-lg font-semibold text-blue-600">{node.name}</h3> */}
      <p className="text-gray-800">{node.question}</p>
      {node.comment && <p className="text-sm text-gray-500">{node.comment}</p>}

      {node.questionImage ? (
        <Flex className="!m-2">
          <NodeImage src={node.questionImage} />{' '}
        </Flex>
      ) : undefined}
    </>
  )
}
