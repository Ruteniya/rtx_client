import { Button, Dropdown, message, Modal, Table } from 'antd'
import { Pto } from '@rtx/types'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useModal from '@hooks/useModal'
import { useDeleteNodeMutation, useGetNodesQuery } from '@api/api-nodes'
import ManageNodesModal from '../ManageNodesModal'

const NodesTable = () => {
  const { data, isLoading } = useGetNodesQuery()
  const [deleteNode] = useDeleteNodeMutation()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentNode, setCurrentNode] = useState<Pto.Nodes.Node>()

  const nodes = data?.items

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Видалити точку?',
      onOk: async () => {
        await deleteNode({ id }).then(() => message.success('Точку видалено'))
      }
    })
  }

  const handleEdit = (record: Pto.Nodes.Node) => {
    setCurrentNode(record)
    openEditModal()
  }

  const columns = [
    {
      title: 'Назва точки',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Тип відповіді',
      dataIndex: 'answerType',
      key: 'answerType'
    },
    {
      title: 'Питання',
      dataIndex: 'question',
      key: 'question'
    },
    {
      title: 'Бали',
      dataIndex: 'points',
      key: 'points'
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: unknown, record: Pto.Nodes.Node) => (
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
        dataSource={nodes || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
      <ManageNodesModal isVisible={isEditModalVisible} closeModal={closeEditModal} nodeData={currentNode} />
    </>
  )
}

export default NodesTable
