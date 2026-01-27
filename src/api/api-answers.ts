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
    getSmallAnswers: builder.query<Pto.Answers.AnswersSmallList, void>({
      query: () => ({
        url: `answers/small`,
        method: 'GET'
      }),
      providesTags: ['SmallAnswers']
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
    getAnswer: builder.query<Pto.Answers.Answer, { id: string }>({
      query: ({ id }) => ({
        url: `answers/full/${id}`,
        method: 'GET'
      }),
      providesTags: (_, __, { id }) => [{ type: 'Answers', id }]
    }),
    giveAnswer: builder.mutation<Pto.Answers.AnswerSmall, Pto.Answers.AddAnswer>({
      query: (body) => {
        if (typeof File !== 'undefined' && body.answerValue && typeof body.answerValue !== 'string') {
          const formData = new FormData()

          // text fields
          Object.entries(body).forEach(([key, value]) => {
            if (key === 'answerValue') return
            if (value !== undefined && value !== null) {
              formData.append(key, String(value))
            }
          })

          formData.append('answerFile', body.answerValue)

          return {
            url: 'answers',
            method: 'POST',
            body: formData
          }
        }

        return {
          url: 'answers',
          method: 'POST',
          body
        }
      },

      invalidatesTags: (result) =>
        result ? [{ type: 'Answers', id: result.id }, 'SmallAnswers'] : ['Answers', 'SmallAnswers']
    }),

    evaluateAnswers: builder.mutation<void, Pto.Answers.EvaluateAnswer[]>({
      query: (body) => ({
        url: `answers/evaluate`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Answers', 'SmallAnswers']
    })
  })
})

export const {
  useGetAnswersQuery,
  useGetSmallAnswersQuery,
  useGetAllAnswersQuery,
  useGiveAnswerMutation,
  useGetAnswerQuery,
  useEvaluateAnswersMutation
} = answersApi
