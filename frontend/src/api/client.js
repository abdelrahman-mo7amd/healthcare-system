import axios from "axios";

// Two separate API clients on purpose: the primary backend and the
// independent appointment microservice are different origins/services.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const appointmentApi = axios.create({
  baseURL: import.meta.env.VITE_APPOINTMENT_API_URL || "http://localhost:5001/api",
});

function attachAuth(instance) {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

attachAuth(api);
attachAuth(appointmentApi);
