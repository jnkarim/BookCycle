import axios from "axios";


const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("ptb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function request(method, url, { data, params, headers } = {}) {
  try {
    const res = await http.request({ method, url, data, params, headers });
    return res.data;
  } catch (err) {
    const responseError = err?.response?.data?.error;
    const message = responseError || err?.message || "Request failed";
    
    console.error(`[API ${method}] ${API_BASE}${url}:`, err?.response || err);
    throw new Error(message);
  }
}

export const api = {
  get: (url, config) => request("GET", url, config),
  post: (url, data, config) => request("POST", url, { ...config, data }),
  put: (url, data, config) => request("PUT", url, { ...config, data }),
  patch: (url, data, config) => request("PATCH", url, { ...config, data }),
  delete: (url, config) => request("DELETE", url, config),
  _http: http,
};

export default api;
