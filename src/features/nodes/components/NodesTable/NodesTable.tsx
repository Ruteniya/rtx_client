import { Button, Dropdown, message, Modal, Table } from 'antd'
import { Pto } from 'rtxtypes'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useModal from '@hooks/useModal'
import { useDeleteNodeMutation, useGetSmallNodesQuery, useLazyGetNodeQuery } from '@api/api-nodes'
import { ManageNodesModal } from '..'

const NodesTable = () => {
  const { data, isLoading } = useGetSmallNodesQuery()
  const [deleteNode] = useDeleteNodeMutation()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentNode, setCurrentNode] = useState<Pto.Nodes.Node>()
  const [getNode] = useLazyGetNodeQuery()

  const nodes = data?.items

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Видалити точку?',
      onOk: async () => {
        await deleteNode({ id })
          .unwrap()
          .then(() => {
            if (currentNode?.id === id) {
              setCurrentNode(undefined)
              closeEditModal()
            }
            message.success('Точку видалено')
          })
          .catch()
      }
    })
  }

  const handleEdit = async (record: Pto.Nodes.NodeSmall) => {
    const nodeStillExists = nodes?.some((n) => n.id === record.id)
    if (!nodeStillExists) {
      message.warning('Ця точка більше не існує')
      return
    }
    await getNode({ id: record.id })
      .unwrap()
      .then((result: Pto.Nodes.Node) => {
        setCurrentNode(result)
        openEditModal()
      })
      .catch()
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
          <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
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
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
      />

      <ManageNodesModal isVisible={isEditModalVisible} closeModal={closeEditModal} nodeData={currentNode} />
    </>
  )
}

export default NodesTable
