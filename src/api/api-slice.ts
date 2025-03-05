import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../app/base-query-with-reauth'

export const apiSlice = createApi({
  reducerPath: '',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Groups', 'Game']
})
