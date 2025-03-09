import { baseQueryWithReauth } from '@app/base-query-with-reauth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: '',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Groups', 'Game', 'Categories', 'CurrentUser']
})
