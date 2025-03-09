import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@app/user-slice'
import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { AppRoutes } from '@app/app-routes'
import { useLogoutMutation } from '@api/api-auth'

interface LogoutButtonProps {
  className?: string
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    console.log('handle logout')
    await logout()
      .unwrap()
      .then(() => {
        dispatch(setUser(null))
        navigate(AppRoutes.login)
      })
  }

  return (
    <Button
      onClick={handleLogout}
      icon={<LogoutOutlined />}
      className={`!border-none w-full !bg-gray-100 max-w-[200px] rounded-2xl${className} `}
    >
      Вийти
    </Button>
  )
}

export default LogoutButton
