import { GoogleOutlined } from '@ant-design/icons'
import { settings } from '../../../../settings'
import { Button } from 'antd'
import React from 'react'

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${settings.backendHost}/auth/google/login`
  }

  return (
    <Button type="primary" icon={<GoogleOutlined />} className="!rounded-xl min-h-10 mt-5" onClick={handleLogin}>
      Продовжити через Google
    </Button>
  )
}

export default LoginButton
