import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { AimOutlined, TagOutlined, UsergroupDeleteOutlined } from '@ant-design/icons'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'

const { Sider, Content } = Layout

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: AppRoutes.game,
      icon: <AimOutlined />,
      label: <Link to={AppRoutes.game}>Гра</Link>
    },
    {
      key: AppRoutes.groups,
      icon: <UsergroupDeleteOutlined />,
      label: <Link to={AppRoutes.groups}>Групи</Link>
    },
    {
      key: AppRoutes.categories,
      icon: <TagOutlined />,
      label: <Link to={AppRoutes.categories}>Категорії</Link>
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <Menu
          selectedKeys={[location.pathname]}
          mode="inline"
          style={{ height: '100%' }}
          items={menuItems}
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
