import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useGetExchangeRatesQuery, useGetPortfolioDetailsQuery } from "../redux/cryptocurrency";
import { useAppSelector } from "../redux/hooks";
import currencyMap from "../symbols";

ChartJS.register(ArcElement, Tooltip, Legend,ChartDataLabels);

interface Currency{
  name: string,
  unit: string,
  value: number,
  type: string
}

const dummy =  { name: 'Bitcoin', unit: 'BTC', value: 1, type: 'crypto' }
export const Analysis = () => {
  const currency = useAppSelector((state)=>state.currency.value);
  const [sell, isSellOpen] = useState(false)
  const [buy, isBuyOpen] = useState(false);
  const [currencySell, isCurrencySell] = useState(dummy);
  const [currencyBuy, isCurrencyBuy] = useState(dummy);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState(0);
  const [curr, setCurr] = useState([]);
  const[exchangeValue,setExchangeValue]=useState(1)
  const { data, isLoading } = useGetExchangeRatesQuery('')
  const { data: marketCap } = useGetPortfolioDetailsQuery('')
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState<number>(1); // Default aspect ratio for smaller screens

    useEffect(() => {
        const updateAspectRatio = () => {
            if (window.innerWidth < 600) {
                setAspectRatio(1); 
            } else {
                setAspectRatio(2);
            }
        };
        
      window.addEventListener('resize', updateAspectRatio);
      updateAspectRatio();
        return () => window.removeEventListener('resize', updateAspectRatio);
    },[]);
  useEffect(() => {
    if(!isLoading){
      setCurr(Object.values(data?.rates));
    }
  },[isLoading])
  const pieData = {
    labels: marketCap?.map((ele:any) => {
      return ele.name
    }),
    datasets: [
      {
        label: `Market_Cap(${currencyMap.get(currency)})`,
        data: marketCap?.map((ele:any) => {
          return ele.market_cap
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          '#60b583',
          '#90120190',
          '#100100150'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          '#60b583',
          '#90120190',
          '#100100150'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options:ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio:aspectRatio,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          useBorderRadius: true,
          borderRadius:20,
          padding: 20,
          textAlign:'left',
          font: {
            size: 14, // Increase font size
          },
          color: 'black',
          pointStyleWidth:20
        },
      },
      tooltip: {
        enabled: true, // Disable tooltips
      },
      datalabels: {
        display:false
        // color: '#f5faf7',
        // font: {
        //   weight: 'bold',
        //   size: 15,
        // },
        // formatter: (value, context) => {
        //   console.log(value)
        //   console.log(context)
        //   return `$${context.chart.legend}`;
        // },
      },
    //   layout: {
    //   padding: {
    //     right: 50, // Adjust the value to increase space between the legend and the chart
    //   },
    // },
      
    },
  };  
  
  const onCurrencySell = (ele:Currency) => {
    isSellOpen(!sell)
    isCurrencySell(ele)
  }
  const onCurrencyBuy = (ele:Currency) => {
    isBuyOpen(!buy)
    isCurrencyBuy(ele)
  }
  useEffect(() => {
    let handler = (event:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        isSellOpen(false)
        isBuyOpen(false);
      }   
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown",handler)
    }
  })
  const doExchange = () => {
    const val = Number(input) / (currencySell.value);
    const result = val * Number(currencyBuy.value);
    setExchangeValue(Number(result.toPrecision(2)));
  }
  const saveInput = (e:ChangeEvent<HTMLInputElement>) => {
    if (!Number(e.target.value) && Number(e.target.value)!==0) {
      console.log(Number(e.target.value))
      setError("Enter Valid value")
      return 
    }
    setInput(Number(e.target.value))
    setError("")
  }
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <div className="basis-1/2 rounded-md p-5 space-y-4 shadow-md bg-white">
        <div className="flex flex-col md:flex-row justify-between">
          <p className="text-xl font-bold ">Portfolio</p>
          <p className="text-gray-400 font-sans">Total Value <span className="text-black font-bold">{ currencyMap.get(currency)}{marketCap?.reduce((acc:number, curr:any) =>acc + Number(curr.market_cap),0 )}</span></p>
        </div>
        <div className="flex px-2 lg:p-4 justify-center">
          <Pie data={pieData} options={options} />
        </div>
      </div>
      <div className="basis-1/2 flex flex-col rounded-md p-5 space-y-4 shadow-md bg-white" ref={dropdownRef}>
        <div className="basis-1/4">
          <p className="text-xl font-bold ">Exchange Coins</p>
        </div>
        <div className="basis-1/4 flex flex-row">
          
          <p className="basis-1/2 self-center flex flex-row justify-around items-center relative">
            
              <span className="text-orange-400 font-medium">Sell </span>
              <button  onClick={()=>isSellOpen(!sell)} className="w-3/4 h-full flex items-center justify-around font-bold text-lg tracking-wider bg-gray-100 rounded-md p-2 m-1">
              {currencySell.name}
                {
                  sell ? (
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
              sell && 
              <div className="absolute bg-white shadow-xl top-0 transform -translate-y-full flex flex-col items-center rounded-md p-2 w-full h-32 overflow-auto">
                {
                  curr.map((ele:Currency,i) => (
                    <div onClick={()=>onCurrencySell(ele)}  key={i} className=" p-2 flex w-full justify-between hover:bg-red-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4">
                      <h3 className="font-bold">{ele.name}</h3>
                    </div>
                  ))
                }
              </div>
            }
            </p>
            <p className="basis-1/2">
              <label className="text-sm text-gray-500 block pb-1">Enter value</label>
              <input type="text" onChange={(e)=>saveInput(e)} className="outline-none border-2 rounded-md p-1 text-center w-full md:w-1/2" placeholder="Amount 0.00" />
            </p>
        </div>
        <div className="basis-1/4 flex flex-row " >
            <p className="basis-1/2 self-center flex flex-row justify-around items-center relative">
              <span className="text-green-700 font-medium">Buy </span>
            <button onClick={()=>isBuyOpen(!buy)} className="w-3/4 h-full flex items-center justify-around font-bold text-lg tracking-wider bg-gray-100 rounded-md p-2 m-1">
              {currencyBuy.name}
              {
                buy ? (
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
              buy && 
              <div className="absolute bg-white shadow-xl top-0 transform -translate-y-full flex flex-col items-center rounded-md p-2 w-full h-32 overflow-auto">
                {
                  curr.map((ele:Currency,i) => (
                    <div onClick={()=>onCurrencyBuy(ele)}  key={i} className=" p-2 flex w-full justify-between hover:bg-red-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4">
                      <h3 className="font-bold text-wrap">{ele.name}</h3>
                    </div>
                  ))
                }
              </div>
            }
            </p>
            <p className="basis-1/2 text-green-700 font-medium self-center">
            {exchangeValue} { currencyBuy.unit}
            </p>
          
        </div>
        <div className="basis-1/4 self-center">
          <button
            onClick={()=>doExchange()}
            type="button"
            className="py-2 px-5 bg-blue-600 outline-none rounded-md text-white font-sans">
            Exchange
          </button>
          {
            error!=="" && <p className="text-red-500">Enter Valid value</p>
          }
        </div>
      </div>
    </div>
  )
}