"use client";


import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import submitSignUpForm from "../api/signUpRequest.tsx"


export function RegisterForm() {

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  // Handle input changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleSubmit (event: React.FormEvent<HTMLFormElement>)  {
    event.preventDefault()

    if (formData.Password != formData.ConfirmPassword) {
      alert('passwords do not match')
      return ("The passwords didnt match")
    }

    submitSignUpForm(formData)

}

  return (
    <section className="bg-gradient-to-b from-rose-100 to-teal-100 dark:from-gray-900 dark:to-indigo-900 bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <a
          href="/"
          className="mb-6 flex items-center text-2xl font-semibold text-black dark:text-white"
        >
          <img
              className="mr-2 h-8 w-8"
              src="owl.svg"
              alt="logo"
            />
          CodexME
        </a>
        <div className="w-full rounded-lg bg-white shadow dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8">
            <h2 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create your Free Account
            </h2>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="username" className="dark:text-white">
                  User Name
                </Label>
                <TextInput 
                  id="username"
                  name="Username"
                  placeholder="Your Username"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email" className="dark:text-white">
                  Your email
                </Label>
                <TextInput
                  id="email"
                  name="Email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="password" className="dark:text-white">
                  Password
                </Label>
                <TextInput
                  id="password"
                  name="Password"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="confirm-password" className="dark:text-white">
                  Confirm password
                </Label>
                <TextInput
                  id="confirm-password"
                  name="ConfirmPassword"
                  placeholder="••••••••"
                  required
                  type="confirm-password"
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    aria-describedby="terms-background"
                    id="terms-background"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label
                    htmlFor="terms-background"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    I accept the&nbsp;
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </Label>
                </div>
              </div>
              <Button color='blue' type="submit" className="w-full">
                Create an account
              </Button>
              <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Already have an account?
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
