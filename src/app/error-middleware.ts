import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { message } from 'antd'
import { AppRoutes } from '@app/app-routes'

export const errorMiddleware: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const errorMessage = action.payload?.data?.message || 'Сталася помилка'
    const errorName = action.payload?.data?.name

    message.error(errorMessage)

    if (errorName === 'TokenExpiredError' && action.payload?.status === 401) {
      window.location.href = AppRoutes.login
    }
  }

  return next(action)
}
