import GroupsTable from '@features/groups/components/GroupsTable'
import ManageGroupsMenu from '@features/groups/components/ManageGroupsMenu/ManageGroupsMenu'
import { Flex } from 'antd'

const Groups = () => {
  return (
    <>
      <ManageGroupsMenu />
      <Flex justify="center">
        <GroupsTable />
      </Flex>
    </>
  )
}

export default Groups
