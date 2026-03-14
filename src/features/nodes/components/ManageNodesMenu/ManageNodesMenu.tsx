import { Button, Dropdown, MenuProps, Modal, Typography } from 'antd'
import { DeleteOutlined, DownOutlined } from '@ant-design/icons'
import useModal from '@hooks/useModal'
import ManageNodesModal from '../ManageNodesModal'
import { useGetCategoriesQuery } from '@api/api-categories'
import { useDeleteNodesWithoutAnswersMutation } from '@api/api-nodes'

const ManageNodesMenu = () => {
  const { openModal, isVisible, closeModal } = useModal()
  const { data: categoriesData, isLoading: isCategoriesDataLoading } = useGetCategoriesQuery()
  const [deleteNodesWithoutAnswers, { isLoading: isDeleting }] = useDeleteNodesWithoutAnswersMutation()
  const categories = categoriesData?.items || []

  const handleDeleteNodesWithoutAnswers = () => {
    Modal.confirm({
      title: 'Видалити точки без відповідей',
      content:
        'Буде видалено всі точки, які не мають жодної відповіді (включно з фото в S3). Цю дію не можна скасувати.',
      okText: 'Видалити',
      cancelText: 'Скасувати',
      okButtonProps: { danger: true },
      onOk: () => deleteNodesWithoutAnswers()
    })
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'add',
      label: 'Додати точку',
      onClick: openModal
    },
    {
      key: 'delete',
      label: 'Видалити точки без відповідей',
      icon: <DeleteOutlined />,
      danger: true,
      disabled: isDeleting,
      onClick: handleDeleteNodesWithoutAnswers
    }
  ]

  return (
    <>
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <Typography.Title level={4}>Точки</Typography.Title>
        <Dropdown menu={{ items: menuItems }}>
          <Button icon={<DownOutlined />}>Керування</Button>
        </Dropdown>
      </div>

      <ManageNodesModal
        isVisible={isVisible}
        closeModal={closeModal}
        categories={categories}
        isLoading={isCategoriesDataLoading}
      />
    </>
  )
}

export default ManageNodesMenu
