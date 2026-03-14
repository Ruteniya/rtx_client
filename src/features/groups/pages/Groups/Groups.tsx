import GroupsTable from '@features/groups/components/GroupsTable'
import ManageGroupsMenu from '@features/groups/components/ManageGroupsMenu/ManageGroupsMenu'
import SendGroupEmailsButton from '@features/groups/components/SendGroupEmailsButton'
import BulkDeleteGroupsButton from '@features/groups/components/BulkDeleteGroupsButton'
import { Divider, Flex } from 'antd'
import { useState } from 'react'

const Groups = () => {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

  return (
    <>
      <ManageGroupsMenu />
      <Flex gap={8} wrap="wrap">
        <SendGroupEmailsButton groupIds={selectedGroupIds} />
        <BulkDeleteGroupsButton groupIds={selectedGroupIds} onClearedSelection={() => setSelectedGroupIds([])} />
      </Flex>
      <Divider />

      <Flex className="overflow-auto" vertical>
        <GroupsTable selection={{ selectedGroupIds, onSelectGroupIds: setSelectedGroupIds }} />
      </Flex>
    </>
  )
}

export default Groups
