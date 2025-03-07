import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { message } from 'antd'

export const errorMiddleware: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const errorMessage = action.payload?.data?.message || 'Сталася помилка'

    message.error(errorMessage)
  }

  return next(action)
}
