import { LoginForm } from "../components/LogInForm";
import { SEO } from "../components/SEO";
import { Layout } from "../layout/Layout";

const LogIn = () => {
  return (
    <Layout className="">
      <SEO
        title="Sign In"
        description="Sign in to your CodexME account."
        path="/login"
        noIndex
      />
      <LoginForm />
    </Layout>
  );
};

export default LogIn;
