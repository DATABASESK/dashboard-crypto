import { Line,Bar } from "react-chartjs-2";
import 'chart.js/auto'; 
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef, useState } from "react";
import currencyMap from "../symbols";
import { useGetHistoricalDataQuery, useGetMarketCapQuery } from "../redux/cryptocurrency";
import extractData from "../extractData";
import { changeCryptoTo } from "../redux/cryptoSlice";
type CoinsList = {
  name: string,
  id:string
}

type Prices = [Date,number]

export const CurrencyGraph = () => {
  const [isCurrencyTypeOpen, setCurrencyTypeOpen] = useState(false)
  const [isChartTypeOpen, setChartTypeOpen] = useState(false)
  const cryptoData = useAppSelector(state => state.crypto.value)
  const dispatch=useAppDispatch()
  const [chartVal, setChart] = useState("Line")
  // const [cryptoVal, setCrypto] = useState("Bitcoin")
  // const [cryptoValId, setCryptoId] = useState("bitcoin")
  const [duration, setDuration] = useState(1)
  const [aspectRatio, setAspectRatio] = useState<number>(1); // Default aspect ratio
  const currency = useAppSelector(state => state.currency.value)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: historicalData, isLoading,isFetching} = useGetHistoricalDataQuery({ currency:currency, id: cryptoData.id===""?"bitcoin":cryptoData.id, duration: duration })
  let { data: coinsList } = useGetMarketCapQuery(currency);
  coinsList = coinsList?.map((ele:CoinsList) => {
    return {id:ele.id,name:ele.name}
  })
  let pricesData = historicalData?.prices;
  if(!isLoading)
  pricesData=extractData(duration, pricesData);

  useEffect(() => {
    const updateAspectRatio = () => {
        if (window.innerWidth < 600) {
            setAspectRatio(1);
        } else {
            setAspectRatio(3); 
      }
    };
    window.addEventListener('resize', updateAspectRatio);
    updateAspectRatio();
    return () => window.removeEventListener('resize', updateAspectRatio);
    },[]);
  const data = {
    labels:pricesData?.map((a:Prices)=>a[0]),
    datasets: [
        {
          label: cryptoData.name===""?"Bitcoin":cryptoData.name,
          data: pricesData?.map((a:Prices)=>a[1]),
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };
    const options = {
      indexAxis: chartVal==="Bar Chart(H)"?'y':'x',
      maintainAspectRatio: true,
      aspectRatio: aspectRatio,
      responsive:true,
      scales: {
        x: {
            beginAtZero:false,
            grid: {
            display: false, // Removes vertical grid lines
          },
        },
        y: {
          beginAtZero: false,
          grid: {
              display: true, // Keeps horizontal grid lines
          },
          title: {
              display: true,
              text: currency.toUpperCase()+"("+currencyMap.get(currency)+")", // Label for the vertical axis
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,
              padding: 20,
          },
        },
        tooltip: {
                enabled: true // Enable tooltips to show data on hover
        },
        datalabels: {
            display: false // Disable data labels on the line chart
        }
      },
    };

  const chartType = [
    "Line",
    "Bar Chart(H)",
    "Bar Chart(V)"
  ]
  
  const changeCurrency = (ele: CoinsList) => {
    dispatch(changeCryptoTo({name:ele.name,id:ele.id}))
    // setCrypto(ele.name)
    // setCryptoId(ele.id);
    setCurrencyTypeOpen(!isCurrencyTypeOpen)
  }
  const changeChart = (ele: string) => {
    setChart(ele)
    setChartTypeOpen(!isChartTypeOpen);
  }
  useEffect(() => {
    let handler = (event:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setChartTypeOpen(false)
        setCurrencyTypeOpen(false);
      }   
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown",handler)
    }
  })

  const buttonClasses = "bg-gray-100 py-1 px-3 w-12 rounded-lg font-semibold";
  return (
    <div className="flex flex-col py-4 px-6 space-y-2 bg-white rounded-md">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="basis-2/4 text-center flex flex-row gap-2 justify-end">
          <button className={`${buttonClasses} ${duration === 1 ? "border-2 border-blue-500" : ""}`} onClick={()=>setDuration(1)}>1D</button>
          <button className={`${buttonClasses} ${duration === 7 ? "border-2 border-blue-500" : ""}`} onClick={()=>setDuration(7)}>1W</button>
          <button className={`${buttonClasses} ${duration === 30 ? "border-2 border-blue-500" : ""}`} onClick={()=>setDuration(30)}>1M</button>
          <button className={`${buttonClasses} ${duration === 180 ? "border-2 border-blue-500" : ""}`} onClick={()=>setDuration(180)}>6M</button>
          <button className={`${buttonClasses} ${duration === 365 ? "border-2 border-blue-500" : ""}`} onClick={()=>setDuration(365)}>1Y</button>
          {/* <button className="bg-gray-100 py-1 px-3 w-12 rounded-lg font-semibold" onClick={()=>setDuration("")}>C</button> */}
        </div>
        <div className="basis-2/4 self-end flex flex-row justify-center items-center space-x-2 h-full w-full" ref={dropdownRef}>
          <div className="basis-1/2 h-full w-full flex relative justify-center items-center" >
            <button onClick={() => setCurrencyTypeOpen(!isCurrencyTypeOpen)} className="h-full w-full flex items-center justify-around font-bold text-lg tracking-wider bg-gray-100 rounded-md p-2">
            {cryptoData.name===""?"Bitcoin":cryptoData.name}
            {
              isCurrencyTypeOpen ? (
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
              isCurrencyTypeOpen && 
              <div className="absolute bg-white shadow-xl top-full flex flex-col items-center rounded-md p-2 w-full h-40 overflow-auto">
                {
                  coinsList.map((ele:CoinsList) => (
                    <div onClick={()=>changeCurrency(ele)}  key={ele.id} className=" p-2 flex w-full justify-between hover:bg-red-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4">
                      <h3 className="font-bold">{ele.name}</h3>
                    </div>
                  ))
                }
              </div>
            }
          </div>
          <div className="basis-1/2 h-full w-full flex relative justify-center items-center">
            <button onClick={() => setChartTypeOpen(!isChartTypeOpen)} className="h-full w-full flex items-center justify-around font-bold text-lg tracking-wider bg-gray-100 rounded-md p-2">
            {chartVal}
            {
              isChartTypeOpen ? (
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
              isChartTypeOpen && 
              <div className="absolute bg-white shadow-xl top-full flex flex-col items-center rounded-md p-2 w-full h-40 overflow-auto">
                {
                  chartType.map((ele,i) => (
                    <div onClick={()=>changeChart(ele)}  key={i} className=" p-2 flex w-full justify-between hover:bg-red-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4">
                      <h3 className="font-bold">{ele.toUpperCase()}</h3>
                    </div>
                  ))
                }
              </div>
            }
          </div>
        </div>
      </div>
      <div>
        {
          isFetching ?
            <div className="flex justify-center items-center">
              <svg aria-hidden="true" className="inline w-8 h-8 mt-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
            :
            chartVal === "Line" ?
              //@ts-ignore
              (<Line data={data} options={options} />) :  
              //@ts-ignore
            (<Bar data={data} options={options} />)
        }
        
      </div>
    </div>
  );
}