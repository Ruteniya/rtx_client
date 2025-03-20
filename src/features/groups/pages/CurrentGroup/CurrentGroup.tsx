import React from 'react'
import GroupDetails from '@features/groups/components/GroupDetails'
import { NodesTabs } from '@features/nodes/components'
import { useGetCategoryQuery } from '@api/api-categories'
import { useGetCurrentUserQuery } from '@api/api-users'

const CurrentGroup: React.FC = () => {
  const { data: currentUser } = useGetCurrentUserQuery()
  // const { data: category } = useGetCategoryQuery(currentUser?.group.categoryId || '', {
  //   skip: currentUser?.group.categoryId == undefined
  // })

  return (
    <div>
      {currentUser?.group ? (
        <GroupDetails group={{ ...currentUser?.group, category: currentUser.group.category }} />
      ) : (
        'Інформація про групу відсутня'
      )}
      <NodesTabs />
    </div>
  )
}

export default CurrentGroup
