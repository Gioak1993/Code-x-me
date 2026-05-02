import apiClient from "./apiClient";

export type ChallengeTestResult = {
  test_case: number;
  passed: boolean;
  comparison: string;
  expected: string;
  actual: string;
};

export type ChallengeSubmissionResponse = {
  passed: boolean;
  message: string;
  results: ChallengeTestResult[];
};

const submitChallenge = async (
  challengeId: string,
  sourceCode: string,
  languageId: number,
) => {
  try {
    const response = await apiClient.post<ChallengeSubmissionResponse>(
      "/submitchallenge",
      {
        challenge_id: challengeId,
        source_code: sourceCode,
        language_id: languageId,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error while submitting code:", error);
    throw error;
  }
};

export default submitChallenge;
