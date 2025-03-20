import { Pto } from '@rtx/types'
import { Flex, Typography } from 'antd'
import { Image } from '@features/system/components'

type NodeProps = {
  node: Pto.Nodes.Node
}

export default function Node({ node }: NodeProps) {
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
