import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { settings } from '../settings'

const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: settings.backendHost,
  credentials: 'include'
})

export { baseQueryWithReauth }
