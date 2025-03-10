import React from 'react'
import { useAppSelector } from '@hooks/useSelector'
import GroupDetails from '@features/groups/components/GroupDetails'

const CurrentGroup: React.FC = () => {
  const group = useAppSelector((state) => state.user.user?.group)

  return <div>{group ? <GroupDetails group={group} /> : 'Інформація про групу відсутня'}</div>
}

export default CurrentGroup
