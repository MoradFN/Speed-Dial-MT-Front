import axios from "axios";

export const fetchInteractionsAPI = (params) => {
  return axios.get("/api/index.php?route=interaction-history", { params });
};
