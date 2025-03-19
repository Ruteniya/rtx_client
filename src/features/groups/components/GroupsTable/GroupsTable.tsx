import { Button, Dropdown, message, Modal, Table, Tag } from 'antd'
import { useDeleteGroupMutation, useGetGroupsQuery } from '@api/groups-api'

import { Pto } from '@rtx/types'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useModal from '@hooks/useModal'
import ManageGroupsModal from '@features/groups/components/ManageGroupModal'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'

const GroupsTable = () => {
  const { data, isLoading } = useGetGroupsQuery()
  const [deleteGroup] = useDeleteGroupMutation()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentGroup, setCurrentGroup] = useState<Pto.Groups.Group>()
  const navigate = useNavigate()
  const groups = data?.items

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Видалити команду?',
      onOk: async () => {
        await deleteGroup(id).then(message.success('Команду видалено'))
      }
    })
  }
  const handleEdit = (record: Pto.Groups.Group) => {
    setCurrentGroup(record)
    openEditModal()
  }

  const columns = [
    {
      title: 'Назва команди',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Кількість учасників',
      dataIndex: 'numberOfParticipants',
      key: 'numberOfParticipants'
    },
    {
      title: 'Категорія',
      dataIndex: 'category',
      key: 'category',
      render: (category: Pto.Categories.Category) => (
        <Tag color={category.color || 'grey'} className="text-white font-bold">
          {category?.name || 'Невизначено'}
        </Tag>
      )
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: unknown, record: Pto.Groups.Group) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Редагувати',
                icon: <EditOutlined />,
                onClick: (_) => {
                  handleEdit(record)
                }
              },
              {
                key: 'delete',
                label: 'Видалити',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(record.id)
              }
            ],
            onClick: (e) => e.domEvent.stopPropagation()
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      )
    }
  ]

  return (
    <>
      <Table
        className="!max-w-[850px] min-w-fit sm:min-w-[80%]"
        dataSource={groups || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        onRow={(record: Pto.Groups.Group) => {
          return { onClick: () => navigate(`${AppRoutes.groups}/${record.id}`) }
        }}
      />
      <ManageGroupsModal isVisible={isEditModalVisible} closeModal={closeEditModal} groupData={currentGroup} />
    </>
  )
}

export default GroupsTable
