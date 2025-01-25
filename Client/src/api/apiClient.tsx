// create a new axios instance with the base URL of the backend server
import axios from "axios";

const environment = import.meta.env.VITE_ENVIRONMENT;

// Determine the base URL based on the environment
const baseURL = environment === "development"
  ? "http://localhost:4000"
  : "https://codexme.net/api";

const apiClient = axios.create({
  baseURL: baseURL, 
  withCredentials: true, // Automatically send cookies
  
});

export default apiClient;
