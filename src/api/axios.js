import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

export const updateAuthorizationHeader = () => {
  instance.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
};

const createAxiosResponseInterceptor = () => {
  const interceptor = instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const config = error.response.config;
      // Reject promise if usual erro
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }
      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      instance.interceptors.response.eject(interceptor);

      return instance
        .get("/auth/refresh-token")
        .then((response) => {
          localStorage.setItem("token", response.data.accessToken);
          updateAuthorizationHeader();
          config.headers["Authorization"] =
            "Bearer " + response.data.accessToken;
          return instance.request(config);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          createAxiosResponseInterceptor();
        });
    }
  );
};

createAxiosResponseInterceptor();

export default instance;
