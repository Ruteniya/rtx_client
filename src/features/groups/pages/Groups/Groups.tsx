import GroupsTable from '@features/groups/components/GroupsTable'
import ManageGroupsMenu from '@features/groups/components/ManageGroupsMenu/ManageGroupsMenu'
import SendGroupEmailsButton from '@features/groups/components/SendGroupEmailsButton'
import { Divider, Flex } from 'antd'
import { useState } from 'react'

const Groups = () => {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])


  return (
    <>
      <ManageGroupsMenu />
      <SendGroupEmailsButton groupIds={selectedGroupIds} />
      <Divider />

      <Flex className="overflow-auto" vertical>
        <GroupsTable selection={{ selectedGroupIds, onSelectGroupIds: setSelectedGroupIds }} />
      </Flex>

    </>
  )
}

export default Groups
