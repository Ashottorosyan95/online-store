import axios from "axios";
// export const baseUrl = process.env.REACT_APP_BACKEND_URL;
export const baseUrl = 'http://localhost:5000';

const server = axios.create({
  baseURL: baseUrl,
  withCredentials: true
});

server.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.access_token;
    config.headers = jwtToken ? {
      Authorization: `Bearer ${jwtToken}`,
    } : {};
    return config;
  },
  (error) => {
    console.log(error);
  }
);

server.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await axios.post(`${baseUrl}/auth/refresh`, {
          withCredentials: true,
        })
        if (accessToken) {
          localStorage.access_token = accessToken.data
          return axios(originalRequest);
        }
      } catch (refreshError) {
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default server;
