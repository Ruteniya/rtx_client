import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Pto } from '@rtx/types'

export interface UserState {
  user: Pto.Users.User | null
  game: Pto.Games.Game | null
}

const initialState: UserState = {
  user: null,
  game: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Pto.Users.User | null>) => {
      state.user = action.payload
    },
    setGame: (state, action: PayloadAction<Pto.Games.Game | null>) => {
      state.game = action.payload
    }
  }
})

export const { setUser, setGame } = userSlice.actions

export default userSlice.reducer
