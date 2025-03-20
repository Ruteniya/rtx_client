import GroupsTable from '@features/groups/components/GroupsTable'
import ManageGroupsMenu from '@features/groups/components/ManageGroupsMenu/ManageGroupsMenu'
import { Divider, Flex } from 'antd'

const Groups = () => {
  return (
    <>
      <ManageGroupsMenu />
      <Divider />

      <Flex className="overflow-auto" vertical>
        <GroupsTable />
      </Flex>
    </>
  )
}

export default Groups
