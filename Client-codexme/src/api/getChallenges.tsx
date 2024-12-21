import axios from "axios";


const getChallenges = async () => {
    try {
        const response = await axios.get("http://localhost:3000/challenges");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error while getting challenges:", error);
        throw error;
    }
};


export default getChallenges;