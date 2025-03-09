import { useState } from 'react'
import { Typography, Card, Flex, Divider } from 'antd'
import { Pto } from '@rtx/types'
import { GameLogo } from '@features/games/components'
import { GroupInfo, GroupSelector, LoginButton } from '@features/auth/components'
import { useAppSelector } from '@hooks/useSelector'
const { Title } = Typography

const Login = () => {
  const game = useAppSelector((state) => state.user.game)

  const [selectedGroup, setSelectedGroup] = useState<Pto.Groups.Group | null>(null)

  const setGroup = (group: Pto.Groups.Group) => setSelectedGroup(group)

  return (
    <Flex vertical className="w-screen h-dvh lg:h-screen bg-secondary" justify="center" align="center" gap={16}>
      <Card className="max-w-[400px] min-w-[270px] text-center p-5 !m-5">
        <Flex justify="center">
          <GameLogo logo={game?.logo || ''} size={40} />
        </Flex>
        <Title level={4}>{game?.name || 'Гра'}</Title>

        <Divider dashed />

        {!selectedGroup ? (
          <GroupSelector setGroup={setGroup} />
        ) : (
          <>
            <GroupInfo group={selectedGroup} />
            <LoginButton />
          </>
        )}
      </Card>
    </Flex>
  )
}

export default Login
