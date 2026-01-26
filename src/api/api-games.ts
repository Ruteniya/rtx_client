import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'
import { getQueryParamString } from '@utils/get-query-param-string'

export const gamesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGame: builder.query<Pto.Games.Game, void>({
      query: () => {
        return {
          url: `games`,
          method: 'GET'
        }
      },
      providesTags: ['Game']
    }),
    createGame: builder.mutation<Pto.Games.Game, Pto.Games.CreateGame & { logo: File | undefined }>({
      query: (data) => {
        const formData = new FormData()

        formData.append('name', data.name)
        formData.append('description', data.description ?? '')
        formData.append('startDate', data.startDate.toISOString())
        formData.append('endDate', data.endDate.toISOString())

        if (data.logo) {
          formData.append('logo', data.logo)
        }

        return {
          url: 'games',
          method: 'POST',
          body: formData
        }
      },
      invalidatesTags: ['Game']
    }),

    updateGame: builder.mutation<
      Pto.Games.Game,
      { id: string; data: Pto.Games.CreateGame & { logo?: File }; options: Pto.Games.UpdateGameOptions }
    >({
      query: ({ id, data, options }) => {
        const formData = new FormData()

        formData.append('name', data.name)
        formData.append('description', data.description ?? '')
        formData.append('startDate', data.startDate.toISOString())
        formData.append('endDate', data.endDate.toISOString())

        if (data.logo && typeof data.logo !== 'string') {
          formData.append('logo', data.logo)
        }

        const queryParams = getQueryParamString({ ...options })

        return {
          url: `games/${id}?${queryParams}`,
          method: 'PUT',
          body: formData
        }
      },
      invalidatesTags: ['Game']
    }),

    deleteGame: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `games/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Game']
    })
  })
})

export const { useGetGameQuery, useCreateGameMutation, useUpdateGameMutation, useDeleteGameMutation } = gamesApi
