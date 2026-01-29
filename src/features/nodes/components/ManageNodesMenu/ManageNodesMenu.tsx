import { Button, Dropdown, MenuProps, Typography } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import useModal from '@hooks/useModal'
import ManageNodesModal from '../ManageNodesModal'
import { useGetCategoriesQuery } from '@api/api-categories'

const ManageNodesMenu = () => {
  const { openModal, isVisible, closeModal } = useModal()
  const { data: categoriesData, isLoading: isCategoriesDataLoading } = useGetCategoriesQuery()
  const categories = categoriesData?.items || []

  const menuItems: MenuProps['items'] = [
    {
      key: 'add',
      label: 'Додати точку',
      onClick: openModal
    }
  ]

  return (
    <>
      <div className="flex justify-between mb-4 flex-wrap">
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
