"use client";

import { Editor } from "@monaco-editor/react";
import { Dropdown, Button } from "flowbite-react";
import { useState } from "react";
import { Card } from "./Card.tsx";


// const options = {
//     readOnly: true, // Make the editor editable
//     lineNumbers: "off" as const, // Show line numbers
//     minimap: {
//       enabled: false, // Enable the minimap
//     },
//     fontSize: 14, // Customize font size
//     scrollBeyondLastLine: false, // Disable scrolling beyond the last line
//   };

//define a type for a function that will be executed on submit
type SubmitFunction = (...args: any[]) => Promise<any>;

//define the props for the button component

interface EditorProps {
    submitFunction: SubmitFunction; // Function to execute on click
    args: any[]; // Arguments for the function
  }


//define the types for the languages
type Language = {
    name: string;
    id: number;
    function: string;
};

const languagesList: Language[] = [
    {
      name: "Python",
      id: 92,
      function: `def solution():\n    # Write your solution here\n    pass`,
    },
    {
      name: "Javascript",
      id: 93,
      function: `function solution() {\n    // Write your solution here\n}`,
    },
    {
      name: "TypeScript",
      id: 94,
      function: `function solution(): void {\n    // Write your solution here\n}`,
    },
  ];

export function CodeEditor(EditorProps: EditorProps) {
    //define the props for the editor
    const [editor, setEditor] = useState({
      defaultValue: "##create your code here",
      languageId: 92,
      defaultLanguage: "python",
      value: "",
      language: "",
    });

    //set the state for changes on the code in the editor

  function handleCodeChange(newValue: string | undefined) {
    if (newValue !== undefined) {
      setEditor({ ...editor, value: newValue });
    }
  }

// when a language is selected on the dropdown, the editor language change so it can give better recommendations
// we also change the language id which is needed for the api

  function handleLanguageChange(
    newLanguage: string | undefined,
    newLanguageId: number | undefined,
  ) {
    if (newLanguage !== undefined && newLanguageId !== undefined) {
      setEditor({
        ...editor,
        language: newLanguage.toLowerCase(),
        languageId: newLanguageId,
      });
    }
  }

  return(
    <Card className="m-2 grid">
        <Card className="m-2 flex">
            <Dropdown
            color="blue"
            className="mx-1"
            label={`Language: ${editor.language.toUpperCase() || "Select"}`}
            >
            {languagesList.map((language) => (
                <Dropdown.Item
                key={language.id}
                onClick={() => handleLanguageChange(language.name, language.id)}
                >
                {language.name}
                </Dropdown.Item>
            ))}
            </Dropdown>
            <Button onClick={()=> EditorProps.submitFunction()} color="blue" className="mx-1">
            Run
            </Button>
        </Card>
      <Card className="mx-2 grid grid-cols-1 ">
        <Card className="m-2 grid grid-cols-1">
          <span className="bg-white text-3xl font-light tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white">
            Input
          </span>
          <Editor
            className="min-h-full w-max"
            height="90vh"
            language={editor.language}
            value={editor.value}
            theme="vs-dark"
            onChange={handleCodeChange}
            
          />
        </Card>
    </Card>
    </Card>
  );
}