import axios from "axios";

export const baseUrl = process.env.REACT_APP_BACKEND_URL;

const server = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    timeout: 5000,
});

server.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const accessToken = await axios.get(`${baseUrl}/refresh`, {
                withCredentials: true,
              });
              if (accessToken) {
                localStorage.access_token = accessToken.data
                return server(originalRequest);
              }
            } catch (refreshError) {
              return refreshError;
            }
          }
        return Promise.reject(error);
    }
);

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

export default server;
