import { useState } from 'react'
import { Input, Button, Typography, Space, Card, Flex, Divider } from 'antd'
import { useLazyGetGroupQuery } from '@api/groups-api'
import { Pto } from '@rtx/types'
import { useOutletContext } from 'react-router-dom'
import { GameLogo } from '@features/games/components'
import { GroupInfo, GroupSelector } from '@features/auth/components'

const { Title } = Typography

const Login = () => {
  const { game } = useOutletContext<{ game?: Pto.Games.Game }>()
  const [selectedGroup, setSelectedGroup] = useState<Pto.Groups.Group | null>(null)

  const setGroup = (group: Pto.Groups.Group) => setSelectedGroup(group)

  return (
    <Flex vertical className="w-screen h-dvh lg:h-screen bg-secondary" justify="center" align="center" gap={16}>
      <Card className="w-[400px] text-center p-5 m-auto">
        <Flex justify="center">
          <GameLogo logo={game?.logo || ''} size={40} />
        </Flex>
        <Title level={4}>{game?.name || 'Гра'}</Title>

        <Divider dashed />

        {!selectedGroup ? <GroupSelector setGroup={setGroup} /> : <GroupInfo group={selectedGroup} />}
      </Card>
    </Flex>
  )
}

export default Login
