import getChallenge from "../api/getChallengeId";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!challenge) {
    return <div>No challenge found.</div>;
  }


  return (
    <Layout className="">
      <h1 className="m-5 bg-white text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white sm:text-5xl">{challenge.problem_name}</h1>
      <div className="mx-auto max-w-7xl">
        <h2 className="text-gray-900 dark:text-white">Problem Explanation</h2>
        <p className="text-gray-900 dark:text-white">{challenge.problem_explanation}</p>
      </div>
    </Layout>
  );
};

export default ChallengePage;
