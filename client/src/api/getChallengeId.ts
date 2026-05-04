import apiClient from "./apiClient";

type Challenge = {
  id: string;
  problem_explanation: string;
  problem_name: string;
  examples: string[];
  example_cases?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starter_code?: Record<string, string>;
  function_signature?: {
    name: string;
    parameters?: Array<{
      name: string;
      type: string;
    }>;
    return_type?: string;
  };
  difficulty: string;
  constraints: string;
};

const getChallenge = async (id: string ) => {
  try {
    const response = await apiClient.get(`/challenge/${id}`);
    const challenge: Challenge = {
      id: response.data.id,
      problem_name: response.data.problem_name,
      problem_explanation: response.data.problem_explanation,
      examples: response.data.examples ?? [],
      example_cases: response.data.example_cases,
      starter_code: response.data.starter_code,
      function_signature: response.data.function_signature,
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
