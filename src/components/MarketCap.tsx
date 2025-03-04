
import { useEffect } from "react"
import { useGetMarketCapQuery } from "../redux/cryptocurrency"
import { useAppSelector } from "../redux/hooks"
import currencyMap from "../symbols"



export const MarketCap = () => {
  const currency = useAppSelector(state => state.currency.value)
  const { data, isFetching,refetch } = useGetMarketCapQuery(currency)
  useEffect(() => {
    if(currency)refetch()
  },[currency,refetch])
  return (
    <div className="overflow-y-auto shadow-xl bg-white rounded-md  ">
      <p className="text-center m-2 text-wrap font-bold text-xl">Market Cap</p>
      {
        isFetching ?
          <div className="h-screen flex justify-center">
            <svg aria-hidden="true" className="inline w-8 h-8 mt-8  text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>:
          <ul role="list" className="divide-y divide-gray-100 px-4 h-screen">
            {
              data?.map((person: any, index: any) => (
                <li key={index} className="flex justify-between py-5 ">
                  <div className="flex min-w-0 gap-x-4">
                    <img alt="" src={person.image} className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                    <div className="min-w-0 flex-auto">
                      <p className="text-md font-semibold leading-6 text-gray-900">{person.name}</p>
                      <p className="mt-1 truncate text-sm leading-5 text-gray-500 ">Mkt.Cap {currencyMap.get(currency)}{Number(person.market_cap).toPrecision(5)}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end">
                    {
                      person.market_cap_change_percentage_24h > 0 ?
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          <span className="flex flex-row items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 transform -rotate-90 animate-glitter text-green-700 ">
                              <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                            </svg>
                            {Number(person.market_cap_change_percentage_24h).toPrecision(3)}%
                          </span>
                        </p>
                        :
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          <span className="flex flex-row items-stretch">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 transform rotate-90 animate-glitter text-red-600 ">
                              <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                            </svg>
                            {(person.market_cap_change_percentage_24h * 100).toFixed(2)}%
                          </span>
                        </p>
                    }
                  </div>
                </li>
              ))}
          </ul>}
    </div>
  )
}

