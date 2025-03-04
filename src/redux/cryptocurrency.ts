import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const cryptoCurrency = createApi({
  reducerPath: 'cryptoCurrency',
  baseQuery: fetchBaseQuery({
    baseUrl:'https://api.coingecko.com/api/v3/'
  }),
  endpoints: (builder) => ({
    getMarketCap: builder.query({
      query: (name) => ({
        url: `coins/markets?vs_currency=${name}`,
        method: "GET",
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iSvCFvaw8Bgx8GM8fi4htqpi'
        }
      })
    }),
    getExchangeRates: builder.query({
      query: () => ({
        url: `exchange_rates`,
        method: "GET",
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iSvCFvaw8Bgx8GM8fi4htqpi'
        }
      })
    }),
    getPortfolioDetails: builder.query({
      query: () => ({
        url: `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&precision=3`,
        method: "GET",
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iSvCFvaw8Bgx8GM8fi4htqpi'
        }
      })
    }),
    getHistoricalData: builder.query({
      query: (name) => ({
        url: `coins/${name.id}/market_chart?vs_currency=${name.currency}&days=${name.duration}`,
        method: "GET",
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iSvCFvaw8Bgx8GM8fi4htqpi'
        }
      })
    }),
    getCoinsListData: builder.query({
      query: () => ({
        url: `coins/list`,
        method: "GET",
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iSvCFvaw8Bgx8GM8fi4htqpi'
        }
      })
    }),
    searchCoin: builder.query({
      query: (name) => ({
        url: `search?query=${name}`,
        method: "GET",
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iSvCFvaw8Bgx8GM8fi4htqpi'
        }
      })
    })
  })
})


export const {
  useGetMarketCapQuery,
  useGetExchangeRatesQuery,
  useGetPortfolioDetailsQuery,
  useGetHistoricalDataQuery,
  useGetCoinsListDataQuery,
  useSearchCoinQuery
} = cryptoCurrency
