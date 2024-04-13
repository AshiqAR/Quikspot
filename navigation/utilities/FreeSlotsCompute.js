const getActiveBookingsCount = activeBookingsData => {
  const currentTime = Date.now();
  const threeMinutes = 3 * 60 * 1000;
  let result = Object.values(activeBookingsData).filter(booking => {
    return (
      !booking.checkInTime || currentTime - booking.checkInTime > threeMinutes
    );
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
  let n = getActiveBookingsCount(activeBookingsData);
  let availableSlotsForDisplay = 0;
  if (vehicleType === "motorcycle") {
    availableSlotsForDisplay = (emptySlots - n) * 2 + halffilled;
    if (availableSlotsForDisplay > totalSlots) {
      availableSlotsForDisplay = totalSlots;
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

export {getAvailableSlots, isIotDataConsistent};
