
import { InfoLayout } from './components/InfoLayout';
import { MarketCap } from './components/MarketCap';


function App() {
  return (
    <div>
      <div className='m-4 flex items-center'>
        <img src='/Screenshot 2024-09-01 224022.png' className='h-20 w-20 object-cover mr-4 rounded-full' alt="Crypto-Dash Logo"/>
        <div>
        <p className='font-bold text-4xl pb-2'>Crypto-Dash</p>
          <p className='italic'>Your One-Stop Dashboard for Real-Time Crypto Insights</p>
          </div>
      </div>
      <div className="flex flex-col lg:flex-row p-4 gap-2 lg:p-10 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100">
        <div className="basis-3/4">
          <InfoLayout/>
        </div>
        <div className="basis-1/4 ">
          <MarketCap/>
        </div>
      </div>
    </div>
    
  )
}

export default App
