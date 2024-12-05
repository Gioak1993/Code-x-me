
import { CodeArea } from '../components/CodeArea';
import { Layout } from '../layout/Layout';



export function Playground () {
    return(
        <Layout className=''>
        <h1 className='text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-5xl bg-white dark:bg-gray-900 m-5'>Playground</h1>
        <CodeArea></CodeArea>
        </Layout>
    )

}