import { Button, Label, TextInput, Checkbox } from "flowbite-react";
import  SubmitLogIn  from "../api/logInRequest"
import { useState } from "react";

export function LoginForm() {

    const [formData, setFormData] = useState ({

      Email : "",
      Password : ""

    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      const { name, value } = e.target ;
      setFormData ((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      console.log(formData)

    };

    function handleSubmit (event: React.FormEvent<HTMLFormElement>)  {

      event.preventDefault()
  
      SubmitLogIn(formData)
  
      console.log(formData)
    };

    

    return (
      <section className=" bg-gradient-to-r from-rose-100 to-teal-100 dark:from-gray-900 dark:to-indigo-900 bg-cover bg-center bg-no-repeat bg-blend-multiply">
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
              <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email" className="mb-2 block dark:text-white">
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
                <div>
                  <Label
                    htmlFor="password"
                    className="mb-2 block dark:text-white"
                  >
                    Password
                  </Label>
                  <TextInput
                    id="confirm-password"
                    name="Password"
                    placeholder="••••••••"
                    required
                    type="password"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <Checkbox id="remember-background" required />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label
                        htmlFor="remember-background"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </Label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button color='blue' type="submit" className="w-full">
                  Log in to your account
                </Button>
              
                    <p className="text-center text-sm text-gray-500 dark:text-gray-300">
                    <Button
                        color="none"
                        href="/signup"
                        className="w-full p-0 text-primary-600 hover:underline dark:text-primary-500 [&>span]:p-0"
                    >
                        Don't have an account?
                    </Button>
                    </p>
            
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
  