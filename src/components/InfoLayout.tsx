import { Analysis } from "./Analysis"
import { CurrencyGraph } from "./CurrencyGraph"
import { SearchBar } from "./SearchBar"


export const InfoLayout = () => {
  return (
    <div className="flex flex-col space-y-2 h-full w-full ">
      {/* <div className="basis-1/12 ">
        <SearchBar/>
      </div >
      <div className="basis-7/12">
        <CurrencyGraph/>
      </div>
      <div className="basis-4/12">
        <Analysis/>
      </div> */}
      <div className="">
        <SearchBar/>
      </div >
      <div className="">
        <CurrencyGraph/>
      </div>
      <div className="">
        <Analysis/>
      </div>
    </div>
  )
}