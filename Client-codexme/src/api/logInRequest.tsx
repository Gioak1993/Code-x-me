import axios from "axios";

type Username = {

    Email: string,
    Password: string,

}

const SubmitLogIn = async (logindata: Username) => {

    try {
        const response = await axios.post ("http://localhost:3000/login", {
            email: logindata.Email,
            password: logindata.Password
        });

        console.log(response.data)
        return response.data

    }
    catch (error) {
        console.error("Error while submitting code:", error);
        throw (error)

    }
    
};

export default SubmitLogIn;

