import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/", // Adjust to your API URL
  withCredentials: true, // Automatically send cookies
});

export default apiClient;

