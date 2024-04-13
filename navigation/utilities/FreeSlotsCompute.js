const getActiveBookingsCount = activeBookingsData => {
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // Three minutes in milliseconds

  let result = Object.values(activeBookingsData).filter(booking => {
    if (!booking.checkInTime) {
      return true; // If there is no check-in time, include the booking
    }

    // Assuming checkInTime is also a Unix timestamp in milliseconds
    const timeDiff = currentTime - booking.checkInTime;

    return timeDiff < fiveMinutes;
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
  let n = getActiveBookingsCount(activeBookingsData);
  console.log("n=", n);
  let availableSlotsForDisplay = 0;
  if (vehicleType === "motorcycle") {
    availableSlotsForDisplay = (totalSlots - fullyfilled - n) * 2 - halffilled;
    if (availableSlotsForDisplay > 2 * totalSlots) {
      availableSlotsForDisplay = 2 * totalSlots;
    }
    return availableSlotsForDisplay < 0 ? 0 : availableSlotsForDisplay;
  }
  // for car
  availableSlotsForDisplay = emptySlots - n;
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
