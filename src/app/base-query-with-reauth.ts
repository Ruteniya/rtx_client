import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: 'http://localhost:4496/',
  prepareHeaders: (headers, {}) => {
    const token = 'dfgdfg'
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export { baseQueryWithReauth }
