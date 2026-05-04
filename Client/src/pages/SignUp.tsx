import { Layout } from "../layout/Layout";
import { RegisterForm } from "../components/SignUpForm";
import { SEO } from "../components/SEO";

const SignUp = () => {
  return (
    <Layout className=" ">
      <SEO
        title="Create Account"
        description="Create a CodexME account to practice coding challenges."
        path="/signup"
        noIndex
      />
      <RegisterForm />
    </Layout>
  );
};

export default SignUp;
