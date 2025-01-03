import apiClient from "./apiClient";


type Challenge = {
  id: string;
  problem_name: string;
  difficulty: string;
};

const getChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await apiClient.get("/challenges");
    return response.data.map((challenge: Challenge) => ({
      id: challenge.id,
      problem_name: challenge.problem_name,
      difficulty: challenge.difficulty,
    }));
  } catch (error) {
    console.error("Error while getting challenges:", error);
    throw error;
  }
};
export default getChallenges;
