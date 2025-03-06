import { Table, Dropdown, Button, message, Modal } from 'antd'
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '@api/api-categories'
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import ManageCategoryModal from '../ManageCategoryModal'
import useModal from '@hooks/useModal'
import { Pto } from '@rtx/types'
import { useState } from 'react'

const CategoriesTable = () => {
  const { data, isLoading } = useGetCategoriesQuery()
  const categories = data?.items
  const [deleteCategory] = useDeleteCategoryMutation()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentCategory, setCurrentCategory] = useState<Pto.Categories.Category>()

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Видалити категорію?',
      onOk: async () => {
        try {
          await deleteCategory(id)
          message.success('Категорію видалено')
        } catch (error) {
          message.error('Помилка при видаленні категорії')
        }
      }
    })
  }
  const handleEdit = (record: Pto.Categories.Category) => {
    setCurrentCategory(record)
    openEditModal()
  }

  const columns = [
    {
      title: 'Назва категорії',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Колір',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <div style={{ backgroundColor: color, width: 30, height: 30 }} />
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Pto.Categories.Category) => (
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
        className="!max-w-[850px] min-w-[80%]"
        dataSource={categories || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
      <ManageCategoryModal isVisible={isEditModalVisible} closeModal={closeEditModal} categoryData={currentCategory} />
    </>
  )
}

export default CategoriesTable
