import axios from "axios";

const API_BASE = "http://localhost:5000/api/pipelines";

export const savePipeline = async (data) => {
  return axios.post(`${API_BASE}/save`, data);
};

export const loadPipeline = async () => {
  return axios.get(`${API_BASE}/load`);
};
