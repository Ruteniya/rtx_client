import { useState } from 'react'
import { Typography, Card, Flex, Divider, Tabs } from 'antd'
import { Pto } from '@rtx/types'
import { GameLogo } from '@features/games/components'
import { GroupInfo, GroupSelector, LoginButton } from '@features/auth/components'
import { useAppSelector } from '@hooks/useSelector'
import { StorageKey, StorageService } from '@services/group.service'
const { Title } = Typography

const Login = () => {
  const game = useAppSelector((state) => state.user.game)

  const [selectedGroup, setSelectedGroup] = useState<Pto.Groups.Group | null>(null)

  const setGroup = (group: Pto.Groups.Group) => setSelectedGroup(group)
  const existingUserId = StorageService.getItem(StorageKey.UserId)

  return (
    <Flex vertical className="w-screen h-dvh lg:h-screen bg-secondary" justify="center" align="center" gap={16}>
      <Card className="login-card max-w-[400px] min-w-[270px] text-center !p-0 !m-5 min-h-[400px]">
        <Tabs
          defaultActiveKey={`${existingUserId ? 'login' : 'register'}`}
          tabBarStyle={{ display: 'flex !important', width: '100% !important' }}
        >
          <Tabs.TabPane tab="Реєстрація" key="register" className="!p-4">
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
          </Tabs.TabPane>
          <Tabs.TabPane tab="Вхід" key="login" className="!p-4">
            <Flex justify="center">
              <GameLogo logo={game?.logo || ''} size={40} />
            </Flex>
            <Title level={4}>{game?.name || 'Гра'}</Title>

            <Divider dashed />
            <Typography.Paragraph>
              Авторизація можлива за умови попередньої реєстрації з кодом команди.
            </Typography.Paragraph>
            <LoginButton />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Flex>
  )
}

export default Login
