import GroupsTable from '@features/groups/components/GroupsTable'
import ManageGroupsMenu from '@features/groups/components/ManageGroupsMenu/ManageGroupsMenu'
import SendGroupEmailsButton from '@features/groups/components/SendGroupEmailsButton'
import { Divider, Flex, Typography } from 'antd'

const Groups = () => {
  return (
    <>
      <ManageGroupsMenu />
      <Divider />

      <Flex className="overflow-auto" vertical>
        <GroupsTable />
      </Flex>

      <Divider />
      <Typography.Title level={2}>Надіслати коди команд</Typography.Title>
      <SendGroupEmailsButton />
    </>
  )
}

export default Groups
