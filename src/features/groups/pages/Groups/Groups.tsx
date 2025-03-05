import { Flex } from 'antd'
import { useGetGroupsQuery } from '../../../../api/groups-api'
import { useGetGameQuery } from '../../../../api/api-games'

const Groups = () => {
  const { data } = useGetGroupsQuery({})
  const { data: game } = useGetGameQuery({})
  console.log('data: ', data)
  return (
    <Flex vertical justify="center" align="center" gap={16} className="h-full text-center">
      Groups:
      {data?.toString()}
      {game?.name}
    </Flex>
  )
}

export default Groups
