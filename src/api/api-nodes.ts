import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'
import { getQueryParamString } from '@utils/get-query-param-string'

export const nodesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNodes: builder.query<Pto.Nodes.NodeList, void>({
      query: () => ({
        url: 'nodes',
        method: 'GET'
      }),
      providesTags: ['Nodes']
    }),
    getShortNodes: builder.query<Pto.Nodes.ShortNodeList, void>({
      query: () => ({
        url: 'nodes/short',
        method: 'GET'
      }),
      providesTags: ['Nodes']
    }),
    getSmallNodes: builder.query<Pto.Nodes.NodeSmallList, Pto.Nodes.NodesListQuery | void>({
      query: (params) => {
        const queryParams = getQueryParamString({ ...(params ?? { page: 1, size: 1000 }) })
        return {
          url: `nodes/small?${queryParams}`,
          method: 'GET'
        }
      },
      providesTags: ['SmallNodes', 'Nodes']
    }),
    getShortNode: builder.query<Pto.Nodes.ShortNode, { id: string }>({
      query: ({ id }) => ({
        url: `nodes/short/${id}`,
        method: 'GET'
      }),
      providesTags: (_, __, { id }) => [{ type: 'Nodes', id }]
    }),
    getNode: builder.query<Pto.Nodes.Node, { id: string }>({
      query: ({ id }) => ({
        url: `nodes/${id}`,
        method: 'GET'
      }),
      providesTags: (_, __, { id }) => [{ type: 'Nodes', id }]
    }),
    createNode: builder.mutation<
      Pto.Nodes.Node,
      Pto.Nodes.CreateNode & { questionImage?: File | null; correctAnswer?: File | null }
    >({
      query: (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('question', data.question)
        formData.append('points', data.points?.toString() ?? '0')
        formData.append('answerType', data.answerType)
        formData.append('comment', data.comment ?? '')
        formData.append('adminDescription', data.adminDescription ?? '')
        if (data.color) formData.append('color', data.color)

        if (
          data.answerType === Pto.Nodes.AnswerType.Text &&
          data.correctAnswer !== undefined &&
          data.correctAnswer !== null &&
          typeof data.correctAnswer === 'string'
        ) {
          formData.append('correctAnswer', data.correctAnswer)
        }

        if (data.questionImage && typeof data.questionImage !== 'string') {
          formData.append('files', data.questionImage, 'questionImage')
        }

        if (
          data.correctAnswer &&
          typeof data.correctAnswer !== 'string' &&
          data.answerType === Pto.Nodes.AnswerType.Photo
        ) {
          formData.append('files', data.correctAnswer, 'correctAnswer')
        }

        return {
          url: 'nodes',
          method: 'POST',
          body: formData
        }
      },
      invalidatesTags: ['Nodes', 'SmallNodes']
    }),

    updateNode: builder.mutation<
      Pto.Nodes.Node,
      {
        id: string
        updateNodeDto: Pto.Nodes.UpdateNode & { questionImage?: File | null; correctAnswer?: File | null }
        options: Pto.Nodes.UpdateNodeOptions
      }
    >({
      query: ({ id, updateNodeDto, options }) => {
        const formData = new FormData()

        if (updateNodeDto.name) formData.append('name', updateNodeDto.name ?? '')
        if (updateNodeDto.question) formData.append('question', updateNodeDto.question ?? '')
        if (updateNodeDto.comment) formData.append('comment', updateNodeDto.comment ?? '')
        if (updateNodeDto.answerType) formData.append('answerType', updateNodeDto.answerType)
        if (updateNodeDto.points) formData.append('points', updateNodeDto.points?.toString() ?? '0')
        if (updateNodeDto.adminDescription) formData.append('adminDescription', updateNodeDto.adminDescription ?? '')
        if (updateNodeDto.color) formData.append('color', updateNodeDto.color)

        if (
          updateNodeDto.answerType === Pto.Nodes.AnswerType.Text &&
          updateNodeDto.correctAnswer !== undefined &&
          updateNodeDto.correctAnswer !== null &&
          typeof updateNodeDto.correctAnswer === 'string'
        ) {
          formData.append('correctAnswer', updateNodeDto.correctAnswer)
        }

        if (updateNodeDto.questionImage && typeof updateNodeDto.questionImage !== 'string') {
          formData.append('files', updateNodeDto.questionImage, 'questionImage')
        }

        if (
          updateNodeDto.correctAnswer &&
          typeof updateNodeDto.correctAnswer !== 'string' &&
          updateNodeDto.answerType === Pto.Nodes.AnswerType.Photo
        ) {
          formData.append('files', updateNodeDto.correctAnswer, 'correctAnswer')
        }

        const queryParams = getQueryParamString({ ...options })

        return {
          url: `nodes/${id}?${queryParams}`,
          method: 'PUT',
          body: formData
        }
      },
      invalidatesTags: ['Nodes', 'SmallNodes']
    }),

    deleteNode: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `nodes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Nodes', 'SmallNodes']
    })
  })
})

export const {
  useGetNodesQuery,

  useGetShortNodesQuery,
  useGetShortNodeQuery,

  useGetSmallNodesQuery,

  useGetNodeQuery,
  useLazyGetNodeQuery,
  useCreateNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation
} = nodesApi
