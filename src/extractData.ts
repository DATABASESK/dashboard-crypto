type Prices = [Date, number]

function getMonthName(monthNumber: number): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Invalid month number. Please provide a number between 1 and 12.");
  }
  return monthNames[monthNumber - 1];
}

function convertToIST(utcMilliseconds: Date, duration: number) {
    const date = new Date(utcMilliseconds);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    let hours = istDate.getUTCHours();

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = istDate.getUTCDate().toString().padStart(2, '0');

    const formattedTime = `${hours}:00 ${ampm}`;

    if (duration === 1) return formattedTime
    if (duration === 7 || duration === 30 ) return `${month}-${day}`
    return getMonthName(parseInt(month));
  }

const extractData = (duration: number, pricesData?: any) => {
  pricesData = pricesData?.map((a: Prices) => {
    return [convertToIST(a[0], duration), a[1]]
  })
    const uniqueData:any= {};
    pricesData.forEach(([time, value]:[time:string,value:number]) => {
      if (!uniqueData.hasOwnProperty(time)) {
        uniqueData[time] = value;
      }
    });
    pricesData =Object.entries(uniqueData);
    return pricesData
  
}

export default extractData