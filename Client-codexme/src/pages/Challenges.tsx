import { Layout } from "../layout/Layout";
import getChallenges from "../api/getChallenges.tsx";
import { Table, TableHead } from "flowbite-react";


const challenges = await getChallenges();



export function Challenges() {
  return (

      <Layout className="">
        <Table className="max-w-6xl mx-auto p-4">
        <TableHead>
            <Table.HeadCell>Challenge</Table.HeadCell>
            <Table.HeadCell>Difficulty</Table.HeadCell>
        </TableHead>
        <Table.Body>
        </Table.Body>

        </Table>
      </Layout>
  );
}
