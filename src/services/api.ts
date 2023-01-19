import axios, { AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import { storageAuthTokenGet } from "@storage/storageAuthToken";

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://10.0.0.125:3333",
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut) => {
  const InterceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data.message === "Token expired" ||
          requestError.response.data.message === "Invalid token"
        ) {
          const oldToken = await storageAuthTokenGet();

          if (!oldToken) {
            signOut();
            return Promise.reject(requestError);
          }
        }

        signOut();
      }

      // TODO
      // FINISH THIS PART

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(InterceptTokenManager);
  };
};

export { api };
