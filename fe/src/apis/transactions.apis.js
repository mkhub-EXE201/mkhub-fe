import http from "../utils/http";

export const transactionUrl = "transactions";

const transactionApis = {
  getAllTransactions: () => http.get(`${transactionUrl}`),
};
export default transactionApis;
