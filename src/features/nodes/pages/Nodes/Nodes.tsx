import { ManageNodesMenu, NodesTable } from '@features/nodes/components'
import { Divider, Flex } from 'antd'

const Nodes = () => {
  return (
    <>
      <ManageNodesMenu />
      <Divider />
      <Flex className="overflow-auto">
        <NodesTable />
      </Flex>
    </>
  )
}

export default Nodes
