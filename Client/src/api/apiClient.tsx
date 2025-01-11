// create a new axios instance with the base URL of the backend server
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://codexme.net/api", 
  withCredentials: true, // Automatically send cookies
});

export default apiClient;
