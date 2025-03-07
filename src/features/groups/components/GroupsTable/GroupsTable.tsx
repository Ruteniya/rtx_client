import { Table, Tag } from 'antd'
import { useGetGroupsQuery } from '@api/groups-api'

import { Pto } from '@rtx/types'

const GroupsTable = () => {
  const { data, isLoading } = useGetGroupsQuery()

  const groups = data?.items

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
    }
  ]

  return (
    <Table
      className="!max-w-[850px] min-w-fit md:min-w-[80%]"
      dataSource={groups || []}
      columns={columns}
      rowKey="id"
      loading={isLoading}
    />
  )
}

export default GroupsTable
