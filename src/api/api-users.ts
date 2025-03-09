import { apiSlice } from './api-slice'
import { Pto } from '@rtx/types'

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<Pto.Users.User, void>({
      query: () => ({
        url: 'users/me',
        method: 'GET'
      }),
      providesTags: ['CurrentUser']
    })
  })
})

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery } = usersApi
