import axios from "axios";
import { loaderService } from "../services/loaderService";
import config from "../config/config";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: config.BACKEND_URL,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    loaderService.show();
    return config;
  },
  (error) => {
    loaderService.hide();
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    loaderService.hide();
    return response;
  },
  (error) => {
    loaderService.hide();
    return Promise.reject(error);
  }
);

export default axiosInstance;
