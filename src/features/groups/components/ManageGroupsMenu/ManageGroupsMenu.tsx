import { Button, Dropdown, MenuProps, Typography } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import ManageGroupsModal from '../ManageGroupModal'
import useModal from '@hooks/useModal'
import UploadGroupsModal from '../UploadGroupsModal'

const ManageGroupsMenu = () => {
  const { openModal, isVisible, closeModal } = useModal()
  const { openModal: openUploadModal, isVisible: isUploadModalVisible, closeModal: closeUploadModal } = useModal()

  const menuItems: MenuProps['items'] = [
    {
      key: 'add',
      label: 'Додати команду',
      onClick: openModal
    },
    {
      key: 'upload',
      label: 'Завантажити команди',
      onClick: openUploadModal
    }
  ]

  return (
    <>
      <div className="flex justify-between mb-4 flex-wrap">
        <Typography.Title level={2}>Команди</Typography.Title>
        <Dropdown menu={{ items: menuItems }}>
          <Button icon={<DownOutlined />}>Керування</Button>
        </Dropdown>
      </div>

      <ManageGroupsModal isVisible={isVisible} closeModal={closeModal} />
      <UploadGroupsModal isVisible={isUploadModalVisible} closeModal={closeUploadModal} />
    </>
  )
}

export default ManageGroupsMenu
