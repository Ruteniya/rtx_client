import { ManageNodesMenu, NodesTable } from '@features/nodes/components'
import { Flex } from 'antd'

const Nodes = () => {
  return (
    <>
      <ManageNodesMenu />
      <Flex justify="center">
        <NodesTable />
      </Flex>
    </>
  )
}

export default Nodes
