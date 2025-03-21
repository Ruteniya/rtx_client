import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'

export const groupsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Pto.Groups.GroupList, void>({
      query: () => {
        return {
          url: `groups`,
          method: 'GET'
        }
      },
      providesTags: ['Groups']
    }),
    getGroup: builder.query<Pto.Groups.Group, string>({
      query: (id) => {
        return {
          url: `groups/${id}`,
          method: 'GET'
        }
      },
      providesTags: ['Groups']
    }),
    getPopulatedGroup: builder.query<Pto.Groups.PopulatedGroup, string>({
      query: (id) => {
        return {
          url: `groups/populated/${id}`,
          method: 'GET'
        }
      },
      providesTags: ['Groups', 'Users']
    }),
    createGroup: builder.mutation<Pto.Groups.Group, Pto.Groups.CreateGroup>({
      query: (data) => {
        return {
          url: `groups`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['Groups']
    }),
    updateGroup: builder.mutation<Pto.Groups.Group, { id: string; data: Pto.Groups.UpdateGroup }>({
      query: ({ id, data }) => ({
        url: `groups/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Groups']
    }),
    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `groups/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Groups']
    })
  })
})

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetPopulatedGroupQuery,
  useLazyGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation
} = groupsApi
