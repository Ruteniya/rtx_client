import React from 'react'
import { useAppSelector } from '@hooks/useSelector'
import GroupDetails from '@features/groups/components/GroupDetails'
import { NodesTabs } from '@features/nodes/components'
import { useGetCategoryQuery } from '@api/api-categories'

const CurrentGroup: React.FC = () => {
  const group = useAppSelector((state) => state.user.user?.group)
  const { data: category } = useGetCategoryQuery(group?.categoryId || '', { skip: group?.categoryId == undefined })

  return (
    <div>
      {group ? <GroupDetails group={{ ...group, category }} /> : 'Інформація про групу відсутня'}
      <NodesTabs />
    </div>
  )
}

export default CurrentGroup
