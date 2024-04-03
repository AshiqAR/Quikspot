import {BACKEND_URL} from "@env";
console.log(BACKEND_URL);

const backendUrls = {
  topupWalletURL: `${BACKEND_URL}/api/user/wallet/topup`,
  updateDetailsURL: `${BACKEND_URL}/api/user/updateDetails`,
  signInURL: `${BACKEND_URL}/api/user/signin`,
  signUpURL: `${BACKEND_URL}/api/user/signup`,
  signOutURL: `${BACKEND_URL}/api/user/signout`,
  changePasswordURL: `${BACKEND_URL}/api/user/changePassword`,
  addVehicleURL: `${BACKEND_URL}/api/user/addVehicle`,
  sendParkAreaVerificationURL: `${BACKEND_URL}/api/parkArea/sendParkAreaDetailstToBeVerified`,
  getMyMessagesURL: `${BACKEND_URL}/api/user/myMessages`,
  getMyTransactionsURL: `${BACKEND_URL}/api/user/myTransactions`,
  getMyVehiclesURL: `${BACKEND_URL}/api/user/myVehicles`,
  getMyParkSpacesURL: `${BACKEND_URL}/api/user/myParkAreas`,
  getParkAreaDetailsURL: `${BACKEND_URL}/api/user/getParkAreaDetails`,
  getAllParkAreasURL: `${BACKEND_URL}/api/parkArea/getAllParkAreas`,
  parkAreaDetailsForBookingURL: `${BACKEND_URL}/api/parkArea/booking/getParkAreaDetails`,
  closeParkAreaURL: `${BACKEND_URL}/api/parkArea/closeParkArea`,
  openParkAreaURL: `${BACKEND_URL}/api/parkArea/openParkArea`,
  activeBookingsURL: `${BACKEND_URL}/api/user/getActiveBookings`,
  pastBookingsURL: `${BACKEND_URL}/api/user/getPastBookings`,
};

export default backendUrls;
