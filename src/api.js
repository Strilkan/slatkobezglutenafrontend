// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:1337/api", // 🔹 koristi adresu tvog Strapi backenda
// });

// export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:1337/api", // 🔹 tvoj Strapi backend
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://slatkobezglutenabackend.onrender.com/api",
});

// Add token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_BASE = "https://slatkobezglutenabackend.onrender.com";

export default API;
