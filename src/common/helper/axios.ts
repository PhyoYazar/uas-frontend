/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_URL } from "../config/env";

export const setupResponseInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

export const setupRequestInterceptor = () => {
  axios.interceptors.request.use(
    (config: any) => {
      const request = { ...config };
      if (!request.url.startsWith("http")) {
        request.url = `${API_URL}${request.url}`;
      }

      return request;
    },
    (error) => Promise.reject(error)
  );
};
