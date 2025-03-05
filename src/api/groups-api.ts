import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'

export const groupsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Pto.Groups.GroupList, {}>({
      query: () => {
        return {
          url: `groups`,
          method: 'GET'
        }
      },
      providesTags: ['Groups']
    })
  })
})

export const { useGetGroupsQuery } = groupsApi
