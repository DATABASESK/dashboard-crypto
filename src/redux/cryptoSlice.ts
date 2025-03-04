import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"


export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    value: {
      id: "",
      name: "",
    }
  },
  reducers: {
    changeCryptoTo: (state,action:PayloadAction<any>) => {
      state.value = { ...action.payload }
    }
  }
})

export const { changeCryptoTo } = cryptoSlice.actions
export const selectCrypto = (state: RootState) => state.counter.value
export default cryptoSlice.reducer