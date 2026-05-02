"use-client";

import getChallenge from "../api/getChallengeId";
// import { useAuth } from "../api/authContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card } from "../components/Card";
import { CodeEditor } from "../components/CodeEditor";
import { Layout } from "../layout/Layout";

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

function formatFunctionSignature(
  signature: Challenge["function_signature"],
) {
  if (!signature?.name) {
    return "solution(...)";
  }

  const parameters = signature.parameters ?? [];
  const formattedParameters = parameters
    .map((parameter) => `${parameter.name}: ${parameter.type}`)
    .join(", ");
  const returnType = signature.return_type ? `: ${signature.return_type}` : "";

  return `${signature.name}(${formattedParameters})${returnType}`;
}

function getChallengeExamples(challenge: Challenge) {
  if (challenge.example_cases && challenge.example_cases.length > 0) {
    return challenge.example_cases;
  }

  return challenge.examples.map(parseExampleText);
}

function parseExampleText(example: string) {
  const inputMatch = example.match(/Input:\s*(.*?)(?=\s+Output:|$)/i);
  const outputMatch = example.match(/Output:\s*(.*?)(?=\s+Explanation:|$)/i);
  const explanationMatch = example.match(/Explanation:\s*(.*)$/i);

  return {
    input: inputMatch?.[1]?.trim() ?? example,
    output: outputMatch?.[1]?.trim() ?? "",
    explanation: explanationMatch?.[1]?.trim() ?? "",
  };
}

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>(); // Extract the challenge ID from the URL
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuth();

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) {
        setError("No challenge ID provided in the URL.");
        setLoading(false);
        return;
      }

      try {
        const data = await getChallenge(id);
        setChallenge(data);
      } catch (err) {
        setError("Failed to fetch challenge. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  // if (!user) {
  //   return (
  //     <Layout className="">
  //       <h1 className="mx-auto my-3 text-3xl text-gray-900 dark:text-white">
  //         Please log in to view this challenge.
  //       </h1>
  //     </Layout>
  //   );
  // }

  if (loading) {
    return (
      <Layout className="">
        <h1 className="text-3xl text-gray-900 dark:text-white">Loading...</h1>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout className="">
        <h1 className="text-3xl text-gray-900 dark:text-white">{error}</h1>
      </Layout>
    );
  }

  if (!challenge) {
    return (
      <Layout className="">
        <h1 className="text-3xl text-gray-900 dark:text-white">No challenge found.</h1>
      </Layout>
    );
  }

  return (
    <Layout className="">
      <h1 className="m-5 bg-white text-center text-xl font-extrabold leading-none tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white sm:text-5xl">
        {challenge?.problem_name}
      </h1>
      <Card className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
        <Card className="m-2 rounded-lg border-2 border-solid border-gray-200 p-3 dark:border-gray-800">
          <h3 className="my-2 text-xl text-gray-900 dark:text-white">
            Problem Explanation
          </h3>

          <p className="text-gray-900 dark:text-white">
            {challenge?.problem_explanation}
          </p>
          <h3 className="my-2 text-xl text-gray-900 dark:text-white">
            Function Signature
          </h3>
          <code className="block rounded bg-gray-100 p-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-white">
            {formatFunctionSignature(challenge.function_signature)}
          </code>
          <h3 className="my-2 text-xl text-gray-900 dark:text-white">
            Examples
          </h3>
          <div className="grid gap-3">
            {getChallengeExamples(challenge).map((example, index) => (
              <Card
                key={`${example.input}-${index}`}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Example {index + 1}
                </h4>
                <div className="grid gap-2 text-sm text-gray-900 dark:text-white">
                  <div>
                    <span className="font-semibold">Input</span>
                    <pre className="mt-1 overflow-x-auto rounded bg-white p-2 font-mono text-xs dark:bg-gray-900">
                      {example.input}
                    </pre>
                  </div>
                  {example.output && (
                    <div>
                      <span className="font-semibold">Output</span>
                      <pre className="mt-1 overflow-x-auto rounded bg-white p-2 font-mono text-xs dark:bg-gray-900">
                        {example.output}
                      </pre>
                    </div>
                  )}
                  {example.explanation && (
                    <p>
                      <span className="font-semibold">Explanation:</span>{" "}
                      {example.explanation}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <h3 className="my-2 text-xl text-gray-900 dark:text-white">
            Constraints
          </h3>
          <p className="text-gray-900 dark:text-white">
            {challenge?.constraints}
          </p>
          <h3 className="my-2 text-xl text-gray-900 dark:text-white">Difficulty</h3>
          <p className="text-gray-900 dark:text-white">
            {challenge?.difficulty}
          </p>
        </Card>
        <Card className="m-2 grid rounded-lg border-2 border-solid border-gray-200 p-3 dark:border-gray-800">
          <h4 className="my-2 text-xl text-gray-900 dark:text-white">
            Implement the function below using the required signature.
          </h4>
          <CodeEditor
            challengeId={challenge.id}
            starterCode={challenge.starter_code}
          />
        </Card>
      </Card>
    </Layout>
  );
};

export default ChallengePage;
