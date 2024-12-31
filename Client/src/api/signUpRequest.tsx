//file to create a new user

import axios from "axios";

type Username = {
  Username: string;
  Email: string;
  Password: string;
};

const submitSignUpForm = async (formdata: Username) => {
  try {
    const response = await axios.post("http://localhost:8080/signup", {
      username: formdata.Username,
      email: formdata.Email,
      password: formdata.Password,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error while submitting code:", error);
    throw error;
  }
};

export default submitSignUpForm;
