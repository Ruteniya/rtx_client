import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'
import { getQueryParamString } from '@utils/get-query-param-string'

export const resultsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateResults: builder.mutation<void, void>({
      query: () => ({
        url: 'results',
        method: 'POST'
      }),
      invalidatesTags: ['Results']
    }),
    getResults: builder.query<Pto.Results.ResultsPopulated, Pto.Results.ResultsListQuery>({
      query: (params) => {
        const queryParams = getQueryParamString(params ?? {})
        return {
          url: queryParams ? `results?${queryParams}` : 'results',
          method: 'GET'
        }
      },
      providesTags: ['Results']
    }),
    getResultsCsv: builder.query<Pto.App.File, void>({
      query: () => {
        return {
          url: 'results/export/csv',
          method: 'GET'
        }
      },
      providesTags: ['Results']
    })
  })
})

export const { useGenerateResultsMutation, useGetResultsQuery, useLazyGetResultsCsvQuery } = resultsApi
