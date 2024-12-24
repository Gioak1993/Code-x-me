import axios from "axios";

const submitChallenge = async (userId: string, challengeId :string, sourceCode: string, languageId: number) => {
    try {
      const response = await axios.post("http://localhost:3000/submitchallenge", {
        user_id: userId,
        challenge_id: challengeId,
        source_code: sourceCode,
        language_id: languageId,
      });
      return response.data;
    } catch (error) {
      console.error("Error while submitting code:", error);
      throw error;
    }
  }

export default submitChallenge;