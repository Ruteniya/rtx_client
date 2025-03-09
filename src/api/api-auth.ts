import { apiSlice } from './api-slice'
import { Pto } from '@rtx/types'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToGroup: builder.mutation<Pto.Users.User, { userId: string; groupId: string }>({
      query: ({ userId, groupId }) => ({
        url: `auth/group/login/${userId}`,
        method: 'POST',
        params: { groupId }
      }),
      invalidatesTags: ['CurrentUser']
    }),
    getCurrentUser: builder.query<Pto.Users.User, void>({
      query: () => ({
        url: 'auth/me',
        method: 'GET'
      }),
      providesTags: ['CurrentUser']
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST'
      }),
      invalidatesTags: ['CurrentUser']
    })
  })
})

export const { useAddToGroupMutation, useGetCurrentUserQuery, useLogoutMutation } = authApi
