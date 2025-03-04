import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './countSlice'
import { cryptoCurrency } from './cryptocurrency'
import { setupListeners } from '@reduxjs/toolkit/query'
import currencySlice from './currencySlice'
import exchangeSlice from './exchangeSlice'
import cryptoSlice from './cryptoSlice'

const store= configureStore({
  reducer: {
    counter: counterSlice,
    currency: currencySlice,
    exchange: exchangeSlice,
    crypto:cryptoSlice,
    [cryptoCurrency.reducerPath]: cryptoCurrency.reducer,
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(cryptoCurrency.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export default store