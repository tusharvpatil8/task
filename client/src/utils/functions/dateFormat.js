const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
  
  // format date - DD, MM YYYY
  export const formatDateToDDMMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = shortMonths[date.getMonth()];
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);
    const formattedDate = `${day}${suffix} ${month}, ${year}`;
    return formattedDate;
  };
  
  // format date - MM-DD-YYYY
  export const formatDateToMMDDYY = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? `0${day}` : day}-${
      month < 10 ? `0${month}` : month
    }-${year.toString().substr(-2)}`;
    return formattedDate;
  };

  //format date - YYYY-MM-DD
  export const formatDateInYYYYMMDD = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };