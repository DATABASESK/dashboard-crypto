import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"


export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    value:"usd"
  },
  reducers: {
    changeTo: (state,action:PayloadAction<string>) => {
      state.value=action.payload
    }
  }
})


export const { changeTo } = currencySlice.actions

export const selectCurrency = (state: RootState) => state.counter.value
export default currencySlice.reducer
