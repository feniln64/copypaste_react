import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        axiosInstance.post("/auth/refresh", {}, { withCredentials: true })
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

      if (error.response.status === 500) {
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;