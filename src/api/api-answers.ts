import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'

export const nodesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnswers: builder.query<Pto.Answers.Answer[], void>({
      query: () => ({
        url: `answers`,
        method: 'GET'
      }),
      providesTags: ['Answers']
    }),
    giveAnswer: builder.mutation<void, Pto.Answers.AddAnswer>({
      query: (body) => ({
        url: `answers`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Answers']
    })
  })
})

export const { useGetAnswersQuery, useGiveAnswerMutation } = nodesApi
