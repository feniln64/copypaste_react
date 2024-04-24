import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'

let baseURL  = ""
if (process.env.NODE_ENV === 'development') {
  baseURL = "http://localhost:9000"
} else {
  baseURL = "https://node.cpypst.online"
}
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const Logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.reload();
  navigator.push("/login");
};
axiosInstance.interceptors.response.use(
  
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.data.message === 'Unauthorized! Need access token' && !originalConfig._retry) {
        axiosInstance.post("/auth/refresh",{refreshToken:localStorage.getItem("refreshToken")})
        .then(response => {
          // console.log("calling interceptor  ");
          // console.log(response.data.accessToken);
          if (response.status === 200) {
            
              const dispatch = useDispatch()
              axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken;
              console.log("access token refreshed");
              originalConfig._retry = true;
              const userInfo=response.data.userInfo
              dispatch(updateUser(userInfo))
              
              return axios(error.response.config);
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
      else if (error.response.status === 'refreshToken expired' && !originalConfig._retry) {
        Logout();
        return axios(originalConfig);
      }

      if (error.response.status === 500) {
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;