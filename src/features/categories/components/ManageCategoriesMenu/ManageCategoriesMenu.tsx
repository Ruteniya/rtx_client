import { Button, Dropdown, MenuProps, Typography } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import ManageCategoryModal from '../ManageCategoryModal'
import useModal from '@hooks/useModal'

const ManageCategoriesMenu = () => {
  const { openModal, isVisible, closeModal } = useModal()

  const menuItems: MenuProps['items'] = [
    {
      key: 'add',
      label: 'Додати категорію',
      onClick: () => openModal()
    }
  ]

  return (
    <>
      <div className="flex justify-between mb-4 flex-wrap">
        <Typography.Title level={2}>Категорії</Typography.Title>
        <Dropdown menu={{ items: menuItems }}>
          <Button icon={<DownOutlined />}>Керування</Button>
        </Dropdown>
      </div>

      <ManageCategoryModal isVisible={isVisible} closeModal={closeModal} />
    </>
  )
}

export default ManageCategoriesMenu
