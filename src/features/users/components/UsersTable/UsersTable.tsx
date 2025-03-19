import { Table, Dropdown, Button, Flex, TablePaginationConfig } from 'antd'
import { EditOutlined, MoreOutlined } from '@ant-design/icons'
import { Pto } from '@rtx/types'
import useModal from '@hooks/useModal'
import { useState } from 'react'
import UpdateUserRoleModal from '../UpdateUserRoleModal'

interface UsersTableProps {
  users: Pto.Users.User[]
  isLoading?: boolean
  showGroup: boolean
  pagination?: TablePaginationConfig
}

const UsersTable: React.FC<UsersTableProps> = ({ users, isLoading, showGroup, pagination }) => {
  const { isVisible, openModal, closeModal } = useModal()
  const [selectedUser, setSelectedUser] = useState<Pto.Users.User | null>(null)

  const handleOpenRoleChangeModal = (user: Pto.Users.User) => {
    setSelectedUser(user)
    openModal()
  }

  const columns = [
    {
      title: "Ім'я",
      dataIndex: 'firstName',
      key: 'firstName'
    },
    {
      title: 'Прізвище',
      dataIndex: 'lastName',
      key: 'lastName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <span>{role}</span>
    },
    ...(showGroup
      ? [
          {
            title: 'Група',
            dataIndex: 'group',
            key: 'group',
            render: (group: { name: string }) => <span>{group?.name || 'Без групи'}</span>
          }
        ]
      : []),

    {
      title: 'Дії',
      key: 'actions',
      render: (_: unknown, record: Pto.Users.User) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'changeRole',
                label: 'Змінити Роль',
                icon: <EditOutlined />,
                onClick: () => handleOpenRoleChangeModal(record)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      )
    }
  ]

  return (
    <Flex vertical className="!overflow-x-auto w-full">
      <Table
        className="!max-w-[850px] min-w-fit sm:min-w-[80%]"
        dataSource={users || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />
      {selectedUser && (
        <UpdateUserRoleModal
          userId={selectedUser.id}
          currentRole={selectedUser.role}
          isVisible={isVisible}
          onClose={closeModal}
        />
      )}
    </Flex>
  )
}

export default UsersTable
