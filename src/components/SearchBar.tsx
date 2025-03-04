import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { changeTo } from "../redux/currencySlice"
import currencyMap from "../symbols"
import { useSearchCoinQuery } from "../redux/cryptocurrency"
import { changeCryptoTo } from "../redux/cryptoSlice"

const curr=[
  'aed',  'ars',  'aud', 'bch',  'bdt', 'bhd',
  'bits', 'bmd',  'bnb', 'brl',  'btc', 'cad',
  'chf',  'clp',  'cny', 'czk',  'dkk', 'dot',
  'eos',  'eth',  'eur', 'gbp',  'gel', 'hkd',
  'huf',  'idr',  'ils', 'inr',  'jpy', 'krw',
  'kwd',  'link', 'lkr', 'ltc',  'mmk', 'mxn',
  'myr',  'ngn',  'nok', 'nzd',  'php', 'pkr',
  'pln',  'rub',  'sar', 'sats', 'sek', 'sgd',
  'thb',  'try',  'twd', 'uah',  'usd', 'vef',
  'vnd',  'xag',  'xau', 'xdr',  'xlm', 'xrp',
  'yfi',  'zar'
]

type Crypto={
      id: string,
      name: string,
      api_symbol: string,
      symbol: string,
      thumb: string
    }

export const SearchBar = () => {
  const currency = useAppSelector(state => state.currency.value)
  const dispatch=useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [input, setInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data, isFetching} = useSearchCoinQuery(input);
  
  const handleInput = (e:any) => {
    if (e.target.value.length > 0) {
      setSearchOpen(true)
    }
    else setSearchOpen(false);
    setInput(e.target.value);
  }
  function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
    let timeoutId:ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>,...args:Parameters<T>) {
      // Clear the previous timeout
      clearTimeout(timeoutId);

      // Set a new timeout
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  const debouncedInputHandler = debounce(handleInput, 300);

  const changeCurrency = (ele: string) => {
    setIsOpen(!isOpen)
    dispatch(changeTo(ele))
  }
  const changeCrypto = (ele: Crypto) => {
    setInput(ele.name)
    setSearchOpen(false);
    dispatch(changeCryptoTo(ele))
  }
  
  useEffect(() => {
    let handler = (event:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }  
      if (searchRef.current) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown",handler)
    }
  })
  return (
    <div className="flex flex-row gap-2 outline-none">
      <div className="basis-1/6 bg-gray-100 font-bold relative flex flex-col items-center rounded-lg outline-none border-gray-300 border-2">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full h-full flex items-center justify-around font-bold text-lg tracking-wider">
          {currency.toUpperCase()}{" ("+currencyMap.get(currency)+")"}
          {
            isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 transform -rotate-90">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
              </svg>
            ): (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 transform rotate-90">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
              </svg>
            )
          }
        </button>
        {
          isOpen && 
          <div className="absolute left-0 z-10 bg-blue-200 shadow-xl top-full flex flex-col items-center rounded-md p-2 lg:w-full h-40 overflow-auto">
            {
              curr.map((ele,i) => (
                <div onClick={()=>changeCurrency(ele)}  key={i} className=" p-4 flex w-full justify-between hover:bg-red-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4">
                  <h3 className="font-bold">{ele.toUpperCase()}</h3>
                  <h3 className="font-bold text-yellow-200">{currencyMap.get(ele)}</h3>
                </div>
              ))
            }
          </div>
        }
      </div>
      <div className="basis-5/6 border-2 relative rounded-lg flex flex-row justify-center items-center p-2 px-4 bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-500" >
          <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
        </svg>
        <input className="h-full w-full px-2 placeholder-slate-500 outline-none" type='text' placeholder="Search by coin" onChange={debouncedInputHandler} />
        {           
          (isSearchOpen) && 
            <div  className="absolute z-10 bg-blue-100 shadow-xl top-full flex flex-col items-center rounded-md p-2 w-full h-40 overflow-auto">
                {
                  isFetching ?
                    <svg aria-hidden="true" className="w-8 h-8 mt-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>:
                (data.coins.length == 0 ?
                  <p ref={searchRef} className="mt-8 font-semibold text-xl">🥲No Crypto Found</p>
                :  
                data?.coins?.map((ele:Crypto, i:number) => (
                  <div  onClick={() => changeCrypto(ele)} key={i} className=" p-4 flex w-full justify-start gap-2 hover:bg-red-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4">
                    <img src={ele.thumb} />
                    <h3 className="font-bold">{ele.name}</h3>
                    {/* <h3 className="font-bold text-yellow-200">{currencyMap.get(ele)}</h3> */}
                  </div>
                )))
              }             
            </div>
        }
      </div>
    </div>
    
  )
}