import { Button, Dropdown, message, Modal, Table, TablePaginationConfig, Tooltip, Typography } from 'antd'
import { Pto } from 'rtxtypes'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useModal from '@hooks/useModal'
import { useDeleteNodeMutation, useLazyGetNodeQuery } from '@api/api-nodes'
import { ManageNodesModal } from '..'

interface NodesTableProps {
  nodes: Pto.Nodes.NodeSmall[]
  isLoading?: boolean
  pagination?: TablePaginationConfig
}

const { Text } = Typography

const NodesTable: React.FC<NodesTableProps> = ({ nodes, isLoading, pagination }) => {
  const [deleteNode] = useDeleteNodeMutation()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentNode, setCurrentNode] = useState<Pto.Nodes.Node>()
  const [getNode] = useLazyGetNodeQuery()

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
      key: 'name',
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-2">
            {record.color && (
              <Tooltip
                title={
                  <div className="flex items-center gap-2">
                    <span>Колір:</span>
                    <Text
                      className="!text-white"
                      copyable={{
                        text: record.color,
                        onCopy: () => message.success('Колір скопійовано')
                      }}
                    >
                      {record.color}
                    </Text>
                  </div>
                }
              >
                <span
                  className="inline-block h-3 w-3 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: record.color }}
                />
              </Tooltip>
            )}

            <span>{text}</span>
          </div>
        )
      }
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
        pagination={pagination}
        rowKey="id"
        loading={isLoading}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
      />

      <ManageNodesModal isVisible={isEditModalVisible} closeModal={closeEditModal} nodeData={currentNode} />
    </>
  )
}

export default NodesTable
