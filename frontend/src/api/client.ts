import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const userEmail = import.meta.env.VITE_USER_EMAIL;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    "X-User-Email": userEmail,
  },
});