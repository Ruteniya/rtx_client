import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { settings } from './settings'

const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: settings.backendUrl,
  credentials: 'include'
})

export { baseQueryWithReauth }
