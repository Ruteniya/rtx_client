import { Button, Dropdown, message, Modal, Table, Tag } from 'antd'
import { useDeleteGroupMutation, useGetGroupsQuery } from '@api/groups-api'

import { Pto } from '@rtx/types'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useModal from '@hooks/useModal'
import ManageGroupsModal from '@features/groups/components/ManageGroupModal'

const GroupsTable = () => {
  const { data, isLoading } = useGetGroupsQuery()
  const [deleteGroup] = useDeleteGroupMutation()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentGroup, setCurrentGroup] = useState<Pto.Groups.Group>()

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
      render: (_: any, record: Pto.Groups.Group) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Редагувати',
                icon: <EditOutlined />,
                onClick: () => handleEdit(record)
              },
              {
                key: 'delete',
                label: 'Видалити',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(record.id)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} />
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
      />
      <ManageGroupsModal isVisible={isEditModalVisible} closeModal={closeEditModal} groupData={currentGroup} />
    </>
  )
}

export default GroupsTable
