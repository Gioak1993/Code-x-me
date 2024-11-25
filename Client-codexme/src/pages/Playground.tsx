import React from 'react';
import { Header } from '../components/Header';
import { CodeArea } from '../components/CodeArea';
import { Editor } from '@monaco-editor/react';


type CardProps = {
    children: React.ReactNode;
    className:string
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
        <>
        <Header></Header>
        <h1 className='text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-5xl bg-white dark:bg-gray-900'>Playground</h1>
        <Card className='grid'>
            <button className='text-center justify-center'>Run</button>
            <Card className='grid grid-cols-2'> 
                <Card className=''>
                    <CodeArea></CodeArea>
                </Card>
                <Card className=''>
                    <Editor></Editor>
                </Card>
            </Card>
        </Card>
        </>
    )

}