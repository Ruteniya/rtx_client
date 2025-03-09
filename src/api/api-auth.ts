import { apiSlice } from './api-slice'
import { Pto } from '@rtx/types'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToGroup: builder.mutation<Pto.Users.User, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `auth/group/login/${groupId}`,
        method: 'POST'
      }),
      invalidatesTags: ['CurrentUser']
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

export const { useAddToGroupMutation, useLogoutMutation } = authApi
