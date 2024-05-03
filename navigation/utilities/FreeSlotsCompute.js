const getActiveBookingsCount = activeBookingsData => {
  console.log("Active bookings data: ", activeBookingsData);
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // Three minutes in milliseconds
  const threeMinutes = 3 * 60 * 1000; // Three minutes in milliseconds
  const oneMinute = 60 * 1000; // Three minutes in milliseconds
  const oneHalfMinutes = 1.5 * 60 * 1000; // Three minutes in milliseconds

  let result = Object.values(activeBookingsData).filter(booking => {
    console.log(booking);
    if (!booking.checkInTime) {
      console.log("No check-in time for booking: ", booking);
      return true; // If there is no check-in time, include the booking
    }

    // Assuming checkInTime is also a Unix timestamp in milliseconds
    const timeDiff = currentTime - booking.checkInTime;

    // return timeDiff < fiveMinutes;
    return timeDiff < oneMinute - 2;
  });

  return result.length;
};

const getCarBookings = activeBookingsData => {
  console.log("Active bookings data: ", activeBookingsData);
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // Three minutes in milliseconds
  const threeMinutes = 3 * 60 * 1000; // Three minutes in milliseconds
  const oneMinute = 60 * 1000; // Three minutes in milliseconds
  const oneHalfMinutes = 1.5 * 60 * 1000; // Three minutes in milliseconds

  let result = Object.values(activeBookingsData).filter(booking => {
    if (booking.vehicleType === "car") {
      console.log(booking);
      if (!booking.checkInTime && booking.expirationTime > currentTime) {
        console.log("No check-in time for booking: ", booking);
        return true;
      }

      // Assuming checkInTime is also a Unix timestamp in milliseconds
      const timeDiff = currentTime - booking.checkInTime;

      // return timeDiff < fiveMinutes;
      return timeDiff < oneMinute - 2;
    }
  });

  return result.length;
};

const getMotorcycleBookings = activeBookingsData => {
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // Three minutes in milliseconds
  const threeMinutes = 3 * 60 * 1000; // Three minutes in milliseconds
  const oneMinute = 60 * 1000; // Three minutes in milliseconds
  const oneHalfMinutes = 1.5 * 60 * 1000; // Three minutes in milliseconds

  let result = Object.values(activeBookingsData).filter(booking => {
    if (booking.vehicleType === "motorcycle") {
      console.log(booking);
      if (!booking.checkInTime && booking.expirationTime > currentTime) {
        console.log("No check-in time for booking: ", booking);
        return true;
      }

      // Assuming checkInTime is also a Unix timestamp in milliseconds
      const timeDiff = currentTime - booking.checkInTime;

      // return timeDiff < fiveMinutes;
      return timeDiff < oneMinute - 2;
    }
  });
  return result.length;
};

const getAvailableSlots = (
  vehicleType,
  iotData,
  activeBookingsData,
  totalSlots
) => {
  let emptySlots = parseInt(iotData.EMPTY);
  let halffilled = parseInt(iotData.HALF);
  let fullyfilled = parseInt(iotData.FULL);
  // let n = getActiveBookingsCount(activeBookingsData);
  let carBookings = getCarBookings(activeBookingsData);
  let motorcycleBookings = getMotorcycleBookings(activeBookingsData);
  // console.log("n=", n);
  let availableSlotsForDisplay = 0;
  if (vehicleType === "motorcycle") {
    availableSlotsForDisplay =
      (totalSlots - fullyfilled - carBookings) * 2 -
      halffilled -
      motorcycleBookings;
    if (availableSlotsForDisplay > 2 * totalSlots) {
      availableSlotsForDisplay = 2 * totalSlots;
    }
    return availableSlotsForDisplay < 0 ? 0 : availableSlotsForDisplay;
  }
  // for car
  availableSlotsForDisplay = emptySlots - carBookings - motorcycleBookings;
  if (availableSlotsForDisplay > totalSlots) {
    availableSlotsForDisplay = totalSlots;
  }
  return availableSlotsForDisplay < 0 ? 0 : availableSlotsForDisplay;
};

const isIotDataConsistent = (iotData, totalSlots) => {
  let emptySlots = parseInt(iotData.EMPTY);
  let halffilled = parseInt(iotData.HALF);
  let fullSlots = parseInt(iotData.FULL);
  console.log(emptySlots, halffilled, fullSlots, totalSlots);
  return emptySlots + halffilled + fullSlots === parseInt(totalSlots);
};

const getCoolOffTime = duration => {
  if (duration > 0 && duration <= 10) {
    return 20;
  } else if (duration > 10 && duration <= 30) {
    return 30;
  }
  return 60;
};

export {getAvailableSlots, isIotDataConsistent, getCoolOffTime};
