"use client";

import Editor from "@monaco-editor/react";
import { Dropdown, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Card } from "./Card.tsx";
import submitCode from "../api/submitCode.tsx";
import { useThemeMode } from "flowbite-react";
import { playgroundLanguages } from "../constants/languages.ts";

const options = {
  readOnly: true, // Make the editor editable
  lineNumbers: "off" as const, // Show line numbers
  minimap: {
    enabled: false, // Enable the minimap
  },
  fontSize: 14, // Customize font size
  scrollBeyondLastLine: false, // Disable scrolling beyond the last line
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

  function handleLanguageChange(language: (typeof playgroundLanguages)[number]) {
    setEditor({
      ...editor,
      language: language.editorLanguage,
      languageId: language.id,
    });
  }

  async function handleRunButton() {
    const sourceCode = editor.value.trim();

    if (!sourceCode) {
      setOutput({ ...output, value: "Please write code before running." });
      return;
    }

    try {
      const result = await submitCode(sourceCode, editor.languageId);
      console.log(result);

      const runOutput = [result.output, result.compile_output]
        .filter((value) => value !== undefined && value !== null)
        .join("");

      setOutput({
        ...output,
        value: runOutput || result.message || "No output returned.",
      });
    } catch (error) {
      console.log(error);
      setOutput({ ...output, value: "Error submitting code." });
    }
  }

  return (
    <Card className="m-2 mx-auto grid w-full max-w-6xl">
      <Card className="m-2 flex">
        <Dropdown
          color="blue"
          className="mx-1"
          label={`Language: ${editor.language || "Select"}`}
        >
          {playgroundLanguages.map((language) => (
            <Dropdown.Item
              key={language.id}
              onClick={() => handleLanguageChange(language)}
            >
              {language.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Button color="blue" className="mx-1" onClick={handleRunButton}>
          Run
        </Button>
      </Card>
      <Card className="mx-2 grid grid-cols-1 ">
        <Card className="m-2 grid grid-cols-1">
          <span className="bg-white text-3xl font-light tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white">
            Input
          </span>
          <Editor
            className="border-zinc-850 min-h-full border-2 dark:border-none"
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
            className="border-zinc-850 min-h-full border-2 dark:border-none "
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
