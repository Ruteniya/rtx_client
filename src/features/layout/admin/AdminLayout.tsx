import React, { useState } from 'react'
import { Layout, Menu, Drawer, Button, Flex, MenuProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import {
  CheckCircleOutlined,
  ExclamationCircleFilled,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  NodeIndexOutlined,
  TableOutlined,
  TagOutlined,
  UsergroupDeleteOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useAppSelector } from '@hooks/useSelector'
import LogoutButton from '@features/auth/components/LogoutButton/LogoutButton'

const { Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const openKeys = ['answers']

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const game = useAppSelector((state) => state.user.game)
  const [collapsed, setCollapsed] = useState(true) // для мобільного Drawer
  const [siderCollapsed, setSiderCollapsed] = useState(false) // для десктопного Sider (дефолт — розгорнутий)

  const menuItems: MenuItem[] = [
    {
      key: AppRoutes.game,
      icon: game?.id ? <CheckCircleOutlined /> : <ExclamationCircleFilled />,
      label: (
        <Link to={AppRoutes.game} className="!font-semibold">
          {game?.name || 'Гра (не обрана)'}
        </Link>
      )
    },
    {
      key: AppRoutes.groups,
      icon: <UsergroupDeleteOutlined />,
      label: <Link to={AppRoutes.groups}>Команди</Link>
    },
    {
      key: AppRoutes.users,
      icon: <UserOutlined />,
      label: <Link to={AppRoutes.users}>Користувачі</Link>
    },
    {
      key: AppRoutes.categories,
      icon: <TagOutlined />,
      label: <Link to={AppRoutes.categories}>Категорії</Link>
    },
    {
      key: AppRoutes.nodes,
      icon: <NodeIndexOutlined />,
      label: <Link to={AppRoutes.nodes}>Точки</Link>
    },
    {
      key: 'answers',
      icon: <MessageOutlined />,
      label: 'Відповіді',
      children: [
        {
          key: AppRoutes.unprocessedAnswers,
          label: <Link to={AppRoutes.unprocessedAnswers}>Неопрацьовані</Link>
        },
        {
          key: AppRoutes.processedAnswers,
          label: <Link to={AppRoutes.processedAnswers}>Опрацьовані</Link>
        },
        {
          key: AppRoutes.allAnswers,
          label: <Link to={AppRoutes.allAnswers}>Усі</Link>
        }
      ]
    },
    {
      key: AppRoutes.results,
      icon: <TableOutlined />,
      label: <Link to={AppRoutes.results}>Результати</Link>
    }
  ]

  const MenuWraper: React.FC<{
    collapsed?: boolean
    showCollapseTrigger?: boolean
  }> = ({ collapsed: menuCollapsed, showCollapseTrigger }) => (
    <Flex vertical justify="space-between" className="h-full bg-white">
      <Flex vertical className="min-h-0 flex-1 overflow-hidden">
        {showCollapseTrigger && (
          <Flex className="shrink-0 justify-end px-2 py-2">
            <Button
              type="text"
              icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              className={`m-1 hover:!text-blue-950 min-w-[72px] ${menuCollapsed ? ' !bg-blue-50' : ''}`}
              onClick={() => setSiderCollapsed((c) => !c)}
              size='large'
            />
          </Flex>
        )}
        <Menu
          selectedKeys={[location.pathname]}
          openKeys={menuCollapsed ? [] : openKeys}
          className="!mt-0 flex-1 !border-none"
          mode="inline"
          items={menuItems}
          style={{ overflow: 'auto', minHeight: 0 }}
          inlineCollapsed={menuCollapsed}
        />
      </Flex>

      <Flex
        className={menuCollapsed ? '!m-2 justify-center shrink-0' : 'max-w-[200px] !m-2 justify-center shrink-0'}
        onClick={(e) => e.stopPropagation()}
      >
        <LogoutButton className="!z-2000 min-w-[72px]" collapsed={menuCollapsed}/>
      </Flex>
    </Flex>
  )

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      {/* Кнопка для відкриття меню на малих екранах */}
      <div className="lg:hidden fixed top-2 left-2 z-50">
        <Button
          type="primary"
          icon={<MenuOutlined />}
          className="h-14 !bg-blue-950"
          onClick={() => setCollapsed(false)}
        />
      </div>

      {/* Drawer для мобільного меню */}
      <Drawer
        open={!collapsed}
        onClose={() => setCollapsed(true)}
        onClick={() => {}}
        placement="left"
        closable
        width={200}
      >
        <MenuWraper />
      </Drawer>

      {/* Бокова панель для великих екранів — висота по viewport, кнопка згортання зверху */}
      <Sider
        breakpoint="lg"
        collapsedWidth={80}
        width={220}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={setSiderCollapsed}
        trigger={null}
        className="hidden lg:block !max-w-[220px] overflow-hidden"
        style={{ background: '#fff', height: '100vh' }}
      >
        <MenuWraper collapsed={siderCollapsed} showCollapseTrigger />
      </Sider>

      <Layout style={{ padding: '0 24px 24px', minHeight: 0, overflow: 'auto' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
