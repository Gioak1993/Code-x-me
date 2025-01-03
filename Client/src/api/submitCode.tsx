// we need to get the data from the backend

// import axios from "axios";
import apiClient from "./apiClient";

const submitCode = async (sourceCode: string, languageId: number) => {
  try {
    const response = await apiClient.post("/submission", {
      source_code: sourceCode,
      language_id: languageId,
    });

    return response.data; // we will handle this in the component
  } catch (error) {
    console.error("Error while submitting code:", error);
    throw error;
  }
};

export default submitCode;