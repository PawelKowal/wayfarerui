import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

export const updateAuthorizationHeader = () => {
  instance.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
};

let refreshTokenPromise;

const createAxiosResponseInterceptor = () => {
  const interceptor = instance.interceptors.response.use(
    (r) => r,
    (error) => {
      if (error.config && error.response && error.response.status === 401) {
        if (!refreshTokenPromise) {
          instance.interceptors.response.eject(interceptor);
          refreshTokenPromise = instance
            .get("/auth/refresh-token")
            .catch((error) => {
              localStorage.removeItem("token");
            })
            .then((response) => {
              createAxiosResponseInterceptor();
              refreshTokenPromise = null;
              return response.data.accessToken;
            });
        }

        return refreshTokenPromise.then((token) => {
          localStorage.setItem("token", token);
          error.config.headers["Authorization"] = "Bearer " + token;
          updateAuthorizationHeader();
          return instance.request(error.config);
        });
      }
      console.log(error);
      return Promise.reject(error);
    }
  );
};

createAxiosResponseInterceptor();

export default instance;
