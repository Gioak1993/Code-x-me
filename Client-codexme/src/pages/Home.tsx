import { Layout } from "../layout/Layout";
import { Hero } from "../components/Hero.tsx";


function App() {
  return (
    <main >
      <Layout className="">
      <Hero></Hero>
      <p className="text-2xl m-5 text-black dark:text-white max-w-5xl text-center mx-auto">Our vision is to democratize access to technology and opportunities, 
        empowering individuals from all walks of life to harness the power of coding and innovation. 
        By providing accessible online tools and resources, Codexme aim to break down barriers and unlock 
        the potential of every aspiring coder, regardless of their background, location or resources.</p>

      </Layout>

    
    </main>
  );
}

export default App;
