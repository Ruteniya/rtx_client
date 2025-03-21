import { Modal, Form, Select, message } from 'antd'
import { Pto } from 'rtxtypes'
import { useState } from 'react'
import { useChangeUserRoleMutation } from '@api/api-users'

interface UpdateUserRoleModalProps {
  userId: string
  currentRole: Pto.Users.UserRoleType
  isVisible: boolean
  onClose: () => void
}

const UpdateUserRoleModal: React.FC<UpdateUserRoleModalProps> = ({ userId, currentRole, isVisible, onClose }) => {
  const [newRole, setNewRole] = useState<Pto.Users.UserRoleType | undefined>(currentRole)
  const [changeUserRole] = useChangeUserRoleMutation()

  const handleRoleChange = (value: Pto.Users.UserRoleType) => {
    setNewRole(value)
  }

  const handleSubmit = async () => {
    if (newRole !== currentRole) {
      try {
        await changeUserRole({ userId, updateRoleDto: { role: newRole! } })
          .unwrap()
          .then(() => {
            message.success('Роль змінено')
            onClose()
          })
          .catch()
      } catch (error) {
        console.error('Failed to change role:', error)
      }
    }
  }

  return (
    <Modal
      loading={!userId}
      title="Змінити Роль"
      open={isVisible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Зберегти"
      cancelText="Скасувати"
    >
      <Form layout="vertical">
        <Form.Item label="Оберіть нову роль">
          <Select
            value={newRole}
            onChange={handleRoleChange}
            disabled={currentRole === Pto.Users.UserRole.SystemAdmin}
            // disabled={newRole === currentRole} // Disable selection of the current role
          >
            {Object.values(Pto.Users.UserRole)
              .filter((role) => role !== Pto.Users.UserRole.SystemAdmin)
              .map((role) => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateUserRoleModal
