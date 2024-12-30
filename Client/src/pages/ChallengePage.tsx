"use-client";

import getChallenge from "../api/getChallengeId";
import { useAuth } from "../api/authContext";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { CodeEditor } from "../components/CodeEditor";
import { Badge } from "flowbite-react";

type Challenge = {
  id: string;
  problem_explanation: string;
  problem_name: string;
  difficulty: string;
  constraints: string;
};

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>(); // Extract the challenge ID from the URL
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();


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

  if (!user) {
    return (
      <Layout className="">
        <h1 className="text-3xl text-gray-900 dark:text-white">
          Please log in to view this challenge.
        </h1>
      </Layout>
    );
  }
  if (!challenge) {
    <Layout className="">
      return <div>No challenge found.</div>;
    </Layout>;
  }

  return (
    <Layout className="">
      <h1 className="m-5 bg-white text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white sm:text-5xl">
        {challenge?.problem_name}
      </h1>
      <Card className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
        <Card className="">
          <h3 className="text-3xl text-gray-900 dark:text-white">
            Problem Explanation
          </h3>
          <p className="text-gray-900 dark:text-white">
            {challenge?.problem_explanation}
          </p>
          <h3 className="text-3xl text-gray-900 dark:text-white">
            Constraints
          </h3>
          <p className="text-gray-900 dark:text-white">
            {challenge?.constraints}
          </p>
          <h3 className="text-3xl text-gray-900 dark:text-white">Difficulty</h3>
          <p className="text-gray-900 dark:text-white">
            {challenge?.difficulty}
          </p>
        </Card>
        <Card className="grid ">
          <CodeEditor />
        </Card>
      </Card>
    </Layout>
  );
};

export default ChallengePage;
