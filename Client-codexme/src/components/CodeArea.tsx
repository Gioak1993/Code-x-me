"use client";

import Editor from '@monaco-editor/react';
import { Dropdown, Button } from 'flowbite-react';
import { useState } from 'react';
import { Card } from './Card.tsx';
import submitCode from '../api/submitCode.tsx'

const options = {
    readOnly: true, // Make the editor editable
    lineNumbers: 'off' as const, // Show line numbers
    minimap: {
      enabled: false, // Enable the minimap
    },
    fontSize: 14, // Customize font size
    scrollBeyondLastLine: false, // Disable scrolling beyond the last line
};




export function CodeArea() {

    //define the props for the editor
    const [editor, setEditor] = useState({
                
        defaultValue : "##create your code here",
        languageId: 92,
        defaultLanguage : "python",
        value : "",
        language: "",
        }
);

    const [output, setOutput] = useState({
        
        value : "",
        memory : "",
        message: "",
        status: "",
        time: "",

    })

    //define the types for the languages 
    type Language = {
        name: string;
        id: number;
        function: string;
    };

    //define an array for the programming languages

    const languagesList: Language[] = [
    { 
        name: "Python", 
        id: 92, 
        function: `def solution():\n    # Write your solution here\n    pass` 
    },
    { 
        name: "Javascript", 
        id: 93, 
        function: `function solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "TypeScript", 
        id: 94, 
        function: `function solution(): void {\n    // Write your solution here\n}`
    },
    { 
        name: "Swift", 
        id: 83, 
        function: `func solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Assembly", 
        id: 45, 
        function: `; Assembly solution\nsolution:\n    ; Write your solution here`
    },
    { 
        name: "Bash", 
        id: 46, 
        function: `solution() {\n    # Write your solution here\n}`
    },
    { 
        name: "C", 
        id: 75, 
        function: `void solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "C++", 
        id: 76, 
        function: `void solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "C#", 
        id: 51, 
        function: `void Solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "COBOL", 
        id: 77, 
        function: `IDENTIFICATION DIVISION.\nPROGRAM-ID. SOLUTION.\nPROCEDURE DIVISION.\n    DISPLAY "Write your solution here".\n    STOP RUN.`
    },
    { 
        name: "D", 
        id: 56, 
        function: `void solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Dart", 
        id: 90, 
        function: `void solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Elixir", 
        id: 57, 
        function: `defmodule Solution do\n  def solution do\n    # Write your solution here\n  end\nend`
    },
    { 
        name: "Erlang", 
        id: 58, 
        function: `solution() ->\n    %% Write your solution here\n    ok.`
    },
    { 
        name: "F#", 
        id: 87, 
        function: `let solution() =\n    // Write your solution here`
    },
    { 
        name: "Fortran", 
        id: 59, 
        function: `PROGRAM Solution\n    PRINT *, "Write your solution here"\nEND PROGRAM Solution`
    },
    { 
        name: "Go", 
        id: 95, 
        function: `package main\n\nimport "fmt"\n\nfunc Solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Grovy", 
        id: 88, 
        function: `def solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Haskell", 
        id: 61, 
        function: `solution :: IO ()\nsolution = do\n    -- Write your solution here`
    },
    { 
        name: "Kotlin", 
        id: 78, 
        function: `fun solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Lua", 
        id: 64, 
        function: `function solution()\n    -- Write your solution here\nend`
    },
    { 
        name: "Objective-C", 
        id: 79, 
        function: `void solution() {\n    // Write your solution here\n}`
    },
    { 
        name: "Octave", 
        id: 66, 
        function: `function solution()\n    % Write your solution here\nend`
    },
    { 
        name: "Perl", 
        id: 85, 
        function: `sub solution {\n    # Write your solution here\n}`
    },
    { 
        name: "R", 
        id: 80, 
        function: `solution <- function() {\n    # Write your solution here\n}`
    },
    { 
        name: "Ruby", 
        id: 72, 
        function: `def solution\n    # Write your solution here\nend`
    },
    { 
        name: "Scala", 
        id: 81, 
        function: `def solution(): Unit = {\n    // Write your solution here\n}`
    },
];
    
    //set the state for changes on the code in the editor 

    function handleCodeChange (newValue:string|undefined){
        if (newValue !== undefined) {
            setEditor({...editor, value:newValue});
        }
    }
    // when a language is selected on the dropdown, the editor language change so it can give better recommendations
    // we also change the language id which is needed for the api

    function handleLanguageChange (newLanguage:string|undefined, newLanguageId:number|undefined) {
        if (newLanguage !== undefined && newLanguageId !== undefined) {
            setEditor({...editor, language:newLanguage.toLowerCase(), languageId:newLanguageId});
        }
    }

    async function handleOutputChange() {
        try {
            const result = await submitCode (editor.value, editor.languageId);
            console.log(result)
            setOutput({...output, value:result.Output}); // display this in your UI
        } catch (error) {
            console.log(error)
            setOutput({...output, value:"Error submitting code."});
        }
    }
    
    return (
        <Card className='grid m-2 '>
            <Card className='flex m-2'>
                <Dropdown color='blue' className='mx-1' label ={`Language: ${editor.language.toUpperCase() || "Select"}`} >
                    {languagesList.map((language) => 
                    <Dropdown.Item key={language.id} onClick={() => handleLanguageChange(language.name, language.id)} >{language.name}</Dropdown.Item>
                        )
                    }
                </Dropdown>
                <Button color='blue' className='mx-1' onClick={handleOutputChange}>Run</Button>
            </Card>
            <Card className='grid grid-cols-1 md:grid-cols-2 mx-2'>
                <Card className='grid grid-cols-1 m-2'>
                    <span className='text-3xl font-light tracking-tight text-gray-900 dark:text-white bg-white dark:bg-gray-900'>Input</span>
                    <Editor
                    className ="min-h-full"
                    height="90vh"
                    language={editor.language}
                    value={editor.value}
                    theme="vs-dark"
                    onChange={handleCodeChange}
                    />
                </Card>
                <Card className='grid grid-cols-1 m-2'>
                    <span className='text-3xl font-light tracking-tight text-gray-900 dark:text-white bg-white dark:bg-gray-900'>Output</span>
                    <Editor
                    className='min-h-full '
                    height="90vh"
                    theme="vs-dark"
                    options={options}
                    value={output.value} 
                    />
                 </Card>
            </Card>
        </Card>
            )
        }
