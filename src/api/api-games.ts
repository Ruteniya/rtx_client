import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'

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
    createGame: builder.mutation<Pto.Games.Game, Pto.Games.CreateGame>({
      query: (createGameDto) => ({
        url: `games`,
        method: 'POST',
        body: createGameDto
      }),
      invalidatesTags: ['Game']
    }),
    updateGame: builder.mutation<Pto.Games.Game, { id: string; updateGameDto: Pto.Games.UpdateGame }>({
      query: ({ id, updateGameDto }) => ({
        url: `games/${id}`,
        method: 'PATCH',
        body: updateGameDto
      }),
      invalidatesTags: ['Game']
    })
  })
})

export const { useGetGameQuery, useCreateGameMutation, useUpdateGameMutation } = gamesApi
