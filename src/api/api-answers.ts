import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'
import { getQueryParamString } from '@utils/get-query-param-string'

export const answersApi = apiSlice.injectEndpoints({
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
        const queryParams = getQueryParamString({ ...params })
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

export const { useGetAnswersQuery, useGetAllAnswersQuery, useGiveAnswerMutation, useEvaluateAnswersMutation } =
  answersApi
