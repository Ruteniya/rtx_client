import { Button, Dropdown, Flex, message, Modal, Table, Tag } from 'antd'
import { useDeleteGroupMutation, useGetGroupsQuery } from '@api/groups-api'

import { Pto } from 'rtxtypes'
import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useModal from '@hooks/useModal'
import ManageGroupsModal from '@features/groups/components/ManageGroupModal'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import Papa from 'papaparse'

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

  const exportToCSV = () => {
    if (!groups?.length) {
      message.warning('Немає даних для експорту')
      return
    }

    const csvData = groups.map((group) => ({
      ID: group.id,
      'Назва команди': group.name,
      'Кількість учасників': group.numberOfParticipants,
      'Категорія ID': group.categoryId,
      'Категорія Назва': group.category.name,
      'Категорія Опис': group.category.description,
      'Колір категорії': group.category.color
    }))

    const csvString = Papa.unparse(csvData)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'groups.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns = [
    {
      title: 'Назва команди',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Pto.Groups.Group, b: Pto.Groups.Group) => a.name.localeCompare(b.name)
    },
    {
      title: 'Кількість учасників',
      dataIndex: 'numberOfParticipants',
      key: 'numberOfParticipants',
      sorter: (a: Pto.Groups.Group, b: Pto.Groups.Group) => a.numberOfParticipants - b.numberOfParticipants
    },
    {
      title: 'Категорія',
      dataIndex: 'category',
      key: 'category',
      sorter: (a: Pto.Groups.Group, b: Pto.Groups.Group) => a.category.name.localeCompare(b.category.name),
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
      <Flex justify="end">
        <Button icon={<DownloadOutlined />} onClick={exportToCSV} style={{ marginBottom: 16 }}>
          Завантажити CSV
        </Button>
      </Flex>
      <Table
        className="!max-w-[850px] min-w-fit sm:min-w-[80%]"
        dataSource={groups || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        onRow={(record: Pto.Groups.Group) => {
          return { onClick: () => navigate(`${AppRoutes.groups}/${record.id}`) }
        }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
      />
      <ManageGroupsModal isVisible={isEditModalVisible} closeModal={closeEditModal} groupData={currentGroup} />
    </>
  )
}

export default GroupsTable
