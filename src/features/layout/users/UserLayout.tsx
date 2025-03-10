import React from 'react'
import { Layout, Menu } from 'antd'
import LogoutButton from '@features/auth/components/LogoutButton/LogoutButton'
import { Link } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { AimOutlined, TeamOutlined } from '@ant-design/icons'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'

const { Content, Header } = Layout

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: AppRoutes.about,
      icon: <AimOutlined />,
      label: <Link to={AppRoutes.about}>Гра</Link>
    },
    {
      key: AppRoutes.currentGroup,
      icon: <TeamOutlined />,
      label: <Link to={AppRoutes.currentGroup}>Команда</Link>
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        className="py-0 !px-2 md:!px-6"
      >
        <Menu selectedKeys={[location.pathname]} mode="horizontal" items={menuItems} className="w-[200px]" />

        <div>
          <LogoutButton />
        </div>
      </Header>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default UserLayout
