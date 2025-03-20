import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { message } from 'antd'
import { AppRoutes } from '@app/app-routes'

export const errorMiddleware: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const errorMessage = action.payload?.data?.message || 'Сталася помилка'
    const errorName = action.payload?.data?.name

    if ((errorName === 'TokenExpiredError' || errorMessage == 'Unauthorized') && action.payload?.status === 401) {
      window.location.href = AppRoutes.login
      return
    }
    message.error(errorMessage)
  }

  return next(action)
}
