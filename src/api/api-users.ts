import { getQueryParamString } from '@utils/get-query-param-string'
import { apiSlice } from './api-slice'
import { Pto } from '@rtx/types'

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<Pto.Users.PopulatedUser, void>({
      query: () => ({
        url: 'users/me',
        method: 'GET'
      }),
      providesTags: ['CurrentUser']
    }),
    changeUserRole: builder.mutation<Pto.Users.User, { userId: string; updateRoleDto: Pto.Users.ChangeUserRole }>({
      query: ({ userId, updateRoleDto }) => ({
        url: `users/${userId}`,
        method: 'PATCH',
        body: updateRoleDto
      }),
      invalidatesTags: ['Users']
    }),
    getAllUsers: builder.query<Pto.Users.UserList, Pto.Users.UsersListQuery>({
      query: (params) => {
        const queryParams = getQueryParamString(params)

        return {
          url: `users/all?${queryParams}`,
          method: 'GET'
        }
      },
      providesTags: ['Users']
    })
  })
})

export const { useGetCurrentUserQuery, useGetAllUsersQuery, useLazyGetCurrentUserQuery, useChangeUserRoleMutation } =
  usersApi
