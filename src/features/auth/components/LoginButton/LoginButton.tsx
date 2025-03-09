import { GoogleOutlined } from '@ant-design/icons'
import { settings } from '@app/settings'
import { Button } from 'antd'
import React from 'react'

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${settings.backendUrl}/auth/google/login`
  }

  return (
    <Button type="primary" icon={<GoogleOutlined />} className="!rounded-2xl bg-red-400 min-h-10" onClick={handleLogin}>
      Продовжити через Google
    </Button>
  )
}

export default LoginButton
