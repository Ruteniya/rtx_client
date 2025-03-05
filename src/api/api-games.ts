import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'

export const gamesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGame: builder.query<Pto.Games.Game, {}>({
      query: () => {
        return {
          url: `games`,
          method: 'GET'
        }
      },
      providesTags: ['Game']
    })
  })
})

export const { useGetGameQuery } = gamesApi
