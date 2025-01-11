import { Layout } from "../layout/Layout.tsx";
import { Hero } from "../components/Hero.tsx";

const Home = () => {
  return (
    <main>
      <Layout className="">
        <Hero></Hero>
        <p className="m-5 mx-auto max-w-5xl text-center text-2xl text-black dark:text-white">
          Our vision is to democratize access to technology and opportunities,
          empowering individuals from all walks of life to harness the power of
          coding and innovation. By providing accessible online tools and
          resources, Codexme aim to break down barriers and unlock the potential
          of every aspiring coder, regardless of their background, location or
          resources.
        </p>
      </Layout>
    </main>
  );
};

export default Home;
