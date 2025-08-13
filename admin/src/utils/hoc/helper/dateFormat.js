const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  
  // day suffix
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    const lastDigit = day % 10;
    const suffixes = ["th", "st", "nd", "rd"];
    return suffixes[lastDigit] || "th";
  };
  
  // format date - DD MM, YYYY
  export const formatDateToDDMMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = shortMonths[date.getMonth()];
    const year = date.getUTCFullYear();
    const suffix = getDaySuffix(day);
    const formattedDate = `${day}${suffix} ${month}, ${year}`;
    return formattedDate;
  };
  
  // format date - YYYY-MM-DD
  export const formatDateToYYYYMMDD = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate(); // Extract day
    const month = date.getMonth() + 1; // Get abbreviated month
    const year = date.getUTCFullYear(); // Extract year
    const formattedDate = `${year}-${month <= 9 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    return formattedDate;
  };
  
  export const formatDateUTCToYYYYMMDD = (dateStr) => {
    // console.log("🚀 ~ formatDateUTCToYYYYMMDD ~ dateStr:", dateStr)
    const date = new Date(dateStr);
    // console.log("🚀 ~ formatDateUTCToYYYYMMDD ~ date:", date)
    const utcDate=date.toUTCString()
    // console.log("🚀 ~ formatDateUTCToYYYYMMDD ~ utcDate:", utcDate)
    const isoDate=new Date(utcDate).toISOString()
    // console.log("🚀 ~ formatDateUTCToYYYYMMDD ~ isoDate:", isoDate)
    return isoDate;
  };
  
  
  