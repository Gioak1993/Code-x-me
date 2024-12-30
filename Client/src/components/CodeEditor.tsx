"use client";

import { Editor } from "@monaco-editor/react";
import { Dropdown, Button, useThemeMode, Badge } from "flowbite-react";
import { useState, useEffect } from "react";
import { Card } from "./Card.tsx";
import submitChallenge from "../api/sumbitChallenge.tsx";
import { useAuth } from "../api/authContext";
import { useParams } from "react-router";
import getChallenge from "../api/getChallengeId.tsx"






//define the types for the languages
type Language = {
    name: string;
    id: number;
    function: string;
};

type Challenge = {
  id: string;
  problem_explanation: string;
  problem_name: string;
  difficulty: string;
  constraints: string;
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

export function CodeEditor() {

  const { id } = useParams<{ id: string }>(); // Extract the challenge ID from the URL
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [result, setResult] = useState({
    value: "Send yout code to see the result",
    color: "gray",
});

    //define the props for the editor
    const [editor, setEditor] = useState({
      defaultValue: "##create your code here",
      languageId: 92,
      defaultLanguage: "python",
      value: "",
      language: "",
      theme: "",
    });

    const { computedMode } = useThemeMode();

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

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) {
        setError("No challenge ID provided in the URL.");
        setLoading(false);
        return;
      }

      try {
        const data = await getChallenge(id);
        setChallenge(data);
      } catch (err) {
        setError("Failed to fetch challenge. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();

  }, [id]);

  async function handleSubmit () {
    if (user && challenge) {
    const result = await submitChallenge(user.id, challenge.id, editor.value, editor.languageId)
      if (result["message"] === "Challenge completed successfully") {
        setResult({value: "Challenge completed successfully", color: "green"})
      }
      else {
        setResult({value: "Challenge failed", color: "red"})
      }
    }
    else {  
      setResult({value: "Please login to submit a challenge", color: "gray"})
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!challenge) {
    return <div>No challenge found.</div>;
  }
  if (!user) {
    return (
      <Card className="m-2 grid grid-cols-1">
        <span className="bg-white text-3xl font-light tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white">
          Please login to submit a challenge
        </span>
      </Card>
    );
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
            <Button onClick={() => handleSubmit()} color="blue" className="mx-1">
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
            height="50vh"
            language={editor.language}
            value={editor.value}
            theme={editor.theme}
            onChange={handleCodeChange}
          />
        </Card>
        <Badge className= "w-fit" color={result.color}>{result.value}</Badge>
    </Card>
    </Card>
  );
}