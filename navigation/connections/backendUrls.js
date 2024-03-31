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
};

export default backendUrls;
