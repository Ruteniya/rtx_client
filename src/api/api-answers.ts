import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'
import { getQueryParamString } from '@utils/get-query-param-string'

export const nodesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnswers: builder.query<Pto.Answers.Answer[], void>({
      query: () => ({
        url: `answers`,
        method: 'GET'
      }),
      providesTags: ['Answers']
    }),
    getAllAnswers: builder.query<Pto.Answers.AnswersList, Pto.Answers.AnswerListQuery>({
      query: (params) => {
        console.log('params: ', params)
        const queryParams = getQueryParamString({ ...params })
        // const queryParams =
        //   'groupIds%5B%5D=26e9b279-3957-4c66-a83b-cefd5e4ad7b7&groupIds%5B%5D=6f1d494f-cc5f-4923-bb93-9a82febab28f'

        return {
          url: `answers/all?${queryParams}`,
          method: 'GET'
        }
      },
      providesTags: ['Answers']
    }),
    giveAnswer: builder.mutation<void, Pto.Answers.AddAnswer>({
      query: (body) => ({
        url: `answers`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Answers']
    }),
    evaluateAnswers: builder.mutation<void, Pto.Answers.EvaluateAnswer[]>({
      query: (body) => ({
        url: `answers/evaluate`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Answers']
    })
  })
})

export const { useGetAnswersQuery, useGetAllAnswersQuery, useGiveAnswerMutation, useEvaluateAnswersMutation } = nodesApi
