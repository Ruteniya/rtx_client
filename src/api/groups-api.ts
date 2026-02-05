import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'
import { getQueryParamString } from '@utils/get-query-param-string'

export const groupsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Pto.Groups.GroupList, Pto.Groups.GroupsListQuery | void>({
      query: (params) => {
        const queryParams = getQueryParamString({ ...(params ?? { page: 1, size: 1000 }) })
        
        return {
          url: `groups?${queryParams}`,
          method: 'GET'
        }
      },
      providesTags: ['Groups']
    }),
    getGroupsCsv: builder.query<Pto.App.File, void>({
      query: () => {
        return {
          url: 'groups/export/csv',
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
    importGroupsCsv: builder.mutation<Pto.Groups.Group[], { groups: Pto.Groups.CsvGroup[] }>({
      query: (body) => ({
        url: 'groups/bulk',
        method: 'POST',
        body
      }),
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
    }),
    sendGroupEmails: builder.mutation<any, Pto.Groups.SendEmails>({
      query: (body) => ({
        url: 'groups/send-emails',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Groups']
    })
  })
})

export const {
  useGetGroupsQuery,
  useLazyGetGroupsCsvQuery,
  useGetGroupQuery,
  useGetPopulatedGroupQuery,
  useLazyGetGroupQuery,
  useCreateGroupMutation,
  useImportGroupsCsvMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useSendGroupEmailsMutation
} = groupsApi
