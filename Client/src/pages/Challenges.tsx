"use-client";

import { Layout } from "../layout/Layout.tsx";
import getChallenges from "../api/getChallenges.tsx";
import { Table, TableHead } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination.tsx";

type Challenge = {
  id: string;
  problem_name: string;
  difficulty: string;
};

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 10;

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
  }, []);

  const handleClick = (id: string) => {
    navigate(`/challenge/${id}`);
  };

  const indexOfLastChallenge = currentPage * challengesPerPage;
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
  
  const filteredChallenges = challenges.filter(challenge =>
    challenge.problem_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <input
        type="text"
        placeholder="Search challenges by name or difficulty..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mx-auto my-5 block w-1/2 p-2 border rounded dark:bg-gray-900 dark:text-white"
      />
      <Table className="mx-auto my-10 max-w-xl">
        <TableHead>
          <Table.HeadCell>Challenges</Table.HeadCell>
          <Table.HeadCell>Difficulty</Table.HeadCell>
        </TableHead>
        <Table.Body>
          {currentChallenges.map((challenge) => (
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
      <Pagination
        challengesPerPage={challengesPerPage}
        totalChallenges={filteredChallenges.length}
        paginate={paginate}
      />
    </Layout>
  );
};

export default Challenges;
