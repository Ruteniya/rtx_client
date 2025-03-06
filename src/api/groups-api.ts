import { Pto } from '@rtx/types'
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
    createGroup: builder.mutation<Pto.Groups.Group, Pto.Groups.CreateGroup>({
      query: (data) => {
        console.log('typeof data', typeof data.numberOfParticipants)
        console.log(data)
        return {
          url: `groups`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['Groups']
    })
  })
})

export const { useGetGroupsQuery, useCreateGroupMutation } = groupsApi
