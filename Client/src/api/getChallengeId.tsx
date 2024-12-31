import axios from "axios";

type Challenge = {
  id: string;
  problem_explanation: string;
  problem_name: string;
  difficulty: string;
  constraints: string;

};

const getChallenge = async (id: string ) => {
  try {
    const response = await axios.get(`http://localhost:8080/challenge/${id}`);
    const challenge: Challenge = {
      id: response.data.id,
      problem_name: response.data.problem_name,
      problem_explanation: response.data.problem_explanation,
      difficulty: response.data.difficulty,
      constraints: response.data.constraints
    };
    return challenge;
  } catch (error) {
    console.error("Error while getting challenge:", error);
    throw error;
  }
};

export default getChallenge;