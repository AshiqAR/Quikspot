import {BACKEND_URL} from "@env";

const backendUrls = {
  topupWalletURL: `${BACKEND_URL}/api/user/wallet/topup`,
  updateDetailsURL: `${BACKEND_URL}/api/user/updateDetails`,
  signInURL: `${BACKEND_URL}/api/user/signin`,
  signUpURL: `${BACKEND_URL}/api/user/signup`,
  signOutURL: `${BACKEND_URL}/api/user/signout`,
  changePasswordURL: `${BACKEND_URL}/api/user/changePassword`,
  addVehicleURL: `${BACKEND_URL}/api/user/addVehicle`,
};

export default backendUrls;
