const ValidateDate = (value, helpers) => {
  // Define a status code based on the existence of FromDate and ToDate
  ////console.log({ value })
  if (value.hasOwnProperty("FromDate") && value.hasOwnProperty("ToDate")) {
    return PassData(value.FromDate, value.ToDate, helpers);
  }
  if (value.hasOwnProperty("BookingFromDate") && value.hasOwnProperty("BookingToDate")) {
    return PassData(value.BookingFromDate, value.BookingToDate, helpers);
  }

  if (value.hasOwnProperty("ShipmentFromDate") && value.hasOwnProperty("ShipmentToDate")) {
    return PassData(value.ShipmentFromDate, value.ShipmentToDate, helpers);
  }



  return value;
};

const PassData = (FromDate, ToDate, helpers) => {
  ////console.log(">>>>", FromDate, ToDate)
  let CFromDate = new Date(FromDate)
  let CToDate = new Date(ToDate)
  let months = daysDiff(CFromDate, CToDate);
  // if (CFromDate >= CToDate) {
  //   return helpers.message("ToDate must be later than FromDate.");
  // } else
  if (months > 31) {
    return helpers.message("The date range must not exceed one month.");
  }
}

function daysDiff(dateFrom, dateTo) {
  // Calculate the difference in total days
  return Math.round((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
}


module.exports = { ValidateDate }