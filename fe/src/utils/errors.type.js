import HttpStatusCode from "../constants/httpStatus";

export const isAxiosError = (error) => {
  return error.isAxiosError;
};

export const isAxiosUnprocessableEntityError = (error) => {
  return (
    isAxiosError &&
    error?.response?.status === HttpStatusCode.UnprocessableEntity
  );
};

export const isAxiosUnauthorizedError = (error) => {
  return (
    isAxiosError && error?.response?.status === HttpStatusCode.Unauthorized
  );
};

export function isAxiosExpiredTokenError(error) {
  return (
    isAxiosUnauthorizedError(error) &&
    error.response?.data?.message === "jwt expired"
  );
}
