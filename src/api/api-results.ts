import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'

export const resultsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateResults: builder.mutation<void, void>({
      query: () => ({
        url: 'results',
        method: 'POST'
      }),
      invalidatesTags: ['Results']
    }),
    getResults: builder.query<Pto.Results.ResultPopulated[], void>({
      query: () => ({
        url: 'results',
        method: 'GET'
      }),
      providesTags: ['Results']
    })
  })
})

export const { useGenerateResultsMutation, useGetResultsQuery } = resultsApi
