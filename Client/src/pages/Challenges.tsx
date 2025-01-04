"use-client";

import { Layout } from "../layout/Layout";
import getChallenges from "../api/getChallenges.tsx";
import { Table, TableHead } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type Challenge = {
  id: string;
  problem_name: string;
  difficulty: string;
};

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallenges();
        setChallenges(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, []); // Empty dependency array ensures the effect runs once after the component mounts

  const handleClick = (id: string) => {
    navigate(`/challenge/${id}`);
  };
  if (challenges.length === 0) {
    return (
      <Layout className="min-h-screen">
        <h1 className="m-5 bg-white text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white sm:text-5xl">
          Challenges
        </h1>
        <p className="text-center">Loading...</p>
      </Layout>
    );
  }
  return (
    <Layout className="min-h-screen">
      <h1 className="m-5 bg-white text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white sm:text-5xl">
        Challenges
      </h1>
      <Table className="mx-auto my-10 max-w-xl">
        <TableHead>
          <Table.HeadCell>Challenges</Table.HeadCell>
          <Table.HeadCell>Difficulty</Table.HeadCell>
        </TableHead>
        <Table.Body>
          {challenges.map((challenge) => (
            <Table.Row
              className="cursor-pointer"
              key={challenge.id}
              onClick={() => handleClick(challenge.id)}
            >
              <Table.Cell>{challenge.problem_name}</Table.Cell>
              <Table.Cell>{challenge.difficulty}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Layout>
  );
};

export default Challenges;
