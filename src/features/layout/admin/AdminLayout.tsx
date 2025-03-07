import React, { useState } from 'react'
import { Layout, Menu, Drawer, Button } from 'antd'
import { Link, useLocation, useOutletContext } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import {
  CheckCircleOutlined,
  ExclamationCircleFilled,
  MenuOutlined,
  TagOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import { Pto } from '@rtx/types'

const { Sider, Content } = Layout

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { game } = useOutletContext<{ game?: Pto.Games.Game }>()
  const [collapsed, setCollapsed] = useState(true)

  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: AppRoutes.game,
      icon: game?.id ? <CheckCircleOutlined /> : <ExclamationCircleFilled />,
      label: <Link to={AppRoutes.game}>{game?.name || 'Гра (не обрана)'}</Link>
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Кнопка для відкриття меню на малих екранах */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Button type="primary" icon={<MenuOutlined />} onClick={() => setCollapsed(false)} className="h-14" />
      </div>

      {/* Drawer для мобільного меню */}
      <Drawer open={!collapsed} onClose={() => setCollapsed(true)} placement="left" closable width={250}>
        <Menu selectedKeys={[location.pathname]} mode="inline" items={menuItems} className="bg-gray-50" />
      </Drawer>

      {/* Бокова панель для великих екранів */}
      <Sider breakpoint="lg" collapsedWidth="0" className="hidden lg:block">
        <Menu
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          style={{ height: '100%' }}
          className="!shadow-lg bg-gray-50"
        />
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
