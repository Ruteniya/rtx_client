import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '@api/api-slice'
import { errorMiddleware } from './error-middleware'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware, errorMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
