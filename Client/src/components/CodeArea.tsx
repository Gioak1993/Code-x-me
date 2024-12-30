"use client";

import Editor from "@monaco-editor/react";
import { Dropdown, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Card } from "./Card.tsx";
import submitCode from "../api/submitCode.tsx";
import { useThemeMode } from "flowbite-react";

const options = {
  readOnly: true, // Make the editor editable
  lineNumbers: "off" as const, // Show line numbers
  minimap: {
    enabled: false, // Enable the minimap
  },
  fontSize: 14, // Customize font size
  scrollBeyondLastLine: false, // Disable scrolling beyond the last line
};

//define the types for the languages
type Language = {
  name: string;
  id: number;
};

export function CodeArea() {
  //define the props for the editor
  const [editor, setEditor] = useState({
    defaultValue: "##create your code here",
    languageId: 92,
    defaultLanguage: "python",
    value: "",
    language: "",
    theme: "",
  });

  const [output, setOutput] = useState({
    value: "",
    memory: "",
    message: "",
    status: "",
    time: "",
  });

  //define an array for the programming languages

  const languagesList: Language[] = [
    {
      name: "Python",
      id: 92,
    },
    {
      name: "Javascript",
      id: 93,
    },
    {
      name: "TypeScript",
      id: 94,
    },
    {
      name: "Swift",
      id: 83,
    },
    {
      name: "Assembly",
      id: 45,
    },
    {
      name: "Bash",
      id: 46,
    },
    {
      name: "C",
      id: 75,
    },
    {
      name: "C++",
      id: 76,
    },
    {
      name: "C#",
      id: 51,
    },
    {
      name: "COBOL",
      id: 77,
    },
    {
      name: "D",
      id: 56,
    },
    {
      name: "Dart",
      id: 90,
    },
    {
      name: "Elixir",
      id: 57,
    },
    {
      name: "Erlang",
      id: 58,
    },
    {
      name: "F#",
      id: 87,
    },
    {
      name: "Fortran",
      id: 59,
    },
    {
      name: "Go",
      id: 95,
    },
    {
      name: "Grovy",
      id: 88,
    },
    {
      name: "Haskell",
      id: 61,
    },
    {
      name: "Kotlin",
      id: 78,
    },
    {
      name: "Lua",
      id: 64,
    },
    {
      name: "Objective-C",
      id: 79,
    },
    {
      name: "Octave",
      id: 66,
    },
    {
      name: "Perl",
      id: 85,
    },
    {
      name: "R",
      id: 80,
    },
    {
      name: "Ruby",
      id: 72,
    },
    {
      name: "Scala",
      id: 81,
    },
  ];

  const { computedMode } = useThemeMode(); // Detect current theme mode

  useEffect(() => {
    const updatedTheme = computedMode === "dark" ? "vs-dark" : "light";
    setEditor((prevEditor) => ({ ...prevEditor, theme: updatedTheme }));
  }, [computedMode]); // Re-run when `computedMode` changes

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

  async function handleOutputChange() {
    try {
      const result = await submitCode(editor.value, editor.languageId);
      console.log(result);
      setOutput({ ...output, value: result.output }); // display this in your UI
    } catch (error) {
      console.log(error);
      setOutput({ ...output, value: "Error submitting code." });
    }
  }

  return (
    <Card className="m-2 mx-auto max-w-6xl grid">
      <Card className="m-2 flex">
        <Dropdown
          color="blue"
          className="mx-1"
          label={`Language: ${editor.language || "Select"}`}
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
        <Button color="blue" className="mx-1" onClick={handleOutputChange}>
          Run
        </Button>
      </Card>
      <Card className="mx-2 grid grid-cols-1 ">
        <Card className="m-2 grid grid-cols-1">
          <span className="bg-white text-3xl font-light tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white">
            Input
          </span>
          <Editor
            className="border-zinc-850 dark:border-none min-h-full border-2"
            height="50vh"
            language={editor.language}
            value={editor.value}
            theme={editor.theme}
            onChange={handleCodeChange}
          />
        </Card>
        <Card className="m-2 grid grid-cols-1">
          <span className="bg-white text-3xl font-light tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white">
            Output
          </span>
          <Editor
            className="border-2 border-zinc-850 dark:border-none min-h-full "
            height="20vh"
            theme={editor.theme}
            options={options}
            value={output.value}
          />
        </Card>
      </Card>
    </Card>
  );
}
