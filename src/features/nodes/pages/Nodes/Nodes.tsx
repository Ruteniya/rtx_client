import { NodesTable } from '@features/nodes/components'
import { Flex } from 'antd'

const Nodes = () => {
  return (
    <>
      {/* <ManageGroupsMenu /> */}
      <Flex justify="center">
        <NodesTable />
      </Flex>
    </>
  )
}

export default Nodes
