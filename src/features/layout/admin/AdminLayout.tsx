import React, { useState } from 'react'
import { Layout, Menu, Drawer, Button, Flex, Typography, Divider } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import {
  CheckCircleOutlined,
  ExclamationCircleFilled,
  MenuOutlined,
  TagOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import { useAppSelector } from '@hooks/useSelector'
import LogoutButton from '@features/auth/components/LogoutButton/LogoutButton'

const { Sider, Content } = Layout

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const game = useAppSelector((state) => state.user.game)
  const [collapsed, setCollapsed] = useState(true)

  const menuItems: ItemType<MenuItemType>[] = [
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
      key: AppRoutes.categories,
      icon: <TagOutlined />,
      label: <Link to={AppRoutes.categories}>Категорії</Link>
    }
  ]

  const MenuWraper: React.FC = () => (
    <Flex vertical justify="space-between" className="h-full bg-white">
      <Menu
        selectedKeys={[location.pathname]}
        className="!mt-2"
        mode="inline"
        items={menuItems}
        style={{ height: '100%' }}
      />

      <Flex className="max-w-[200px] !m-2" justify="center" onClick={(e) => e.stopPropagation()}>
        <LogoutButton className="!z-2000" />
      </Flex>
    </Flex>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        onClick={() => setCollapsed(true)}
        placement="left"
        closable
        width={200}
      >
        <MenuWraper />
      </Drawer>

      {/* Бокова панель для великих екранів */}
      <Sider breakpoint="lg" collapsedWidth="0" className="hidden lg:block bg-transparent">
        <MenuWraper />
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
