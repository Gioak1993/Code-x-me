import React from 'react';
import { Header } from '../components/Header';
import { CodeArea } from '../components/CodeArea';
import { Editor } from '@monaco-editor/react';
import { Button } from 'flowbite-react';


type CardProps = {
    children: React.ReactNode,
    className: string,
};

function Card ({children, className}: CardProps) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export function Playground () {
    return(
        <div className='bg-white dark:bg-gray-900'>
        <Header></Header>
        <h1 className='text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-5xl bg-white dark:bg-gray-900'>Playground</h1>
        {/* <Card className='grid m-7 border-solid border-2 w-full'>
            <Button className='text-center mx-auto'>Run</Button>
            <Card className='grid grid-cols-1 lg:grid-cols-2 '> 
                <Card className=''> */}
                    <CodeArea></CodeArea>
                {/* </Card>
                <Card className=''>
                    <Editor></Editor>
                </Card>
            </Card>
        </Card> */}
        </div>
    )

}