import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"


export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState: {
    value: {
      buy: "Bitcoin",
      sell:"Bitcoin"
    }
  },
  reducers: {
    saveExchangeRate: (state, action) => {
      state.value.buy = action.payload.buy
      state.value.sell = action.payload.sell
    }
  }
})

export const { saveExchangeRate } = exchangeSlice.actions
export const selectExchange = (state: RootState) => state.counter.value
export default exchangeSlice.reducer