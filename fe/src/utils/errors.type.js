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
