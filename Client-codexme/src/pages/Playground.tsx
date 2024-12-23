import { CodeArea } from "../components/CodeArea";
import { Layout } from "../layout/Layout";

const Playground = () => {
  return (
    <Layout className="">
      <h1 className="m-5 bg-white text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white sm:text-5xl">
        Playground
      </h1>
      <CodeArea></CodeArea>
    </Layout>
  );
};

export default Playground;
