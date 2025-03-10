import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@app/user-slice'
import { Button, Modal } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { AppRoutes } from '@app/app-routes'
import { useLogoutMutation } from '@api/api-auth'
import useModal from '@hooks/useModal'

interface LogoutButtonProps {
  className?: string
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isVisible, openModal, closeModal } = useModal()

  const handleOk = async () => {
    closeModal()
    await logout()
      .unwrap()
      .then(() => {
        dispatch(setUser(null))
        navigate(AppRoutes.login)
      })
  }

  return (
    <>
      <Button
        onClick={openModal}
        icon={<LogoutOutlined />}
        className={`!border-none w-full !bg-gray-100 max-w-[200px] rounded-2xl ${className}`}
      >
        Вийти
      </Button>

      <Modal
        title="Підтвердження виходу"
        open={isVisible}
        onOk={handleOk}
        onCancel={closeModal}
        okText="Так"
        cancelText="Ні"
      >
        <p>Ви справді хочете вийти з облікового запису?</p>
      </Modal>
    </>
  )
}

export default LogoutButton
