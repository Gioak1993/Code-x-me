"use client";

import { Editor } from "@monaco-editor/react";
import { Badge, Button, Dropdown, useThemeMode } from "flowbite-react";
import { useEffect, useState } from "react";
import submitChallenge from "../api/sumbitChallenge.tsx";
import type { ChallengeTestResult } from "../api/sumbitChallenge.tsx";
import { challengeLanguages } from "../constants/languages.ts";
import { Card } from "./Card.tsx";

type CodeEditorProps = {
  challengeId: string;
  starterCode?: Record<string, string>;
};

type ResultColor = "gray" | "green" | "red" | "yellow";

const emptyStarterCode: Record<string, string> = {};

export function CodeEditor({
  challengeId,
  starterCode = emptyStarterCode,
}: CodeEditorProps) {
  const defaultLanguage = challengeLanguages[0];
  const defaultStarterCode =
    starterCode[defaultLanguage.editorLanguage] ?? defaultLanguage.starterCode ?? "";
  const [result, setResult] = useState<{
    value: string;
    color: ResultColor;
    testResults: ChallengeTestResult[];
  }>({
    value: "Send your code to see the result",
    color: "gray",
    testResults: [],
  });

  const [editor, setEditor] = useState({
    languageId: defaultLanguage.id,
    value: defaultStarterCode,
    language: defaultLanguage.editorLanguage,
    theme: "",
  });

  const { computedMode } = useThemeMode();

  useEffect(() => {
    const updatedTheme = computedMode === "dark" ? "vs-dark" : "light";
    setEditor((prevEditor) => ({ ...prevEditor, theme: updatedTheme }));
  }, [computedMode]);

  useEffect(() => {
    setEditor((prevEditor) => ({
      ...prevEditor,
      value: getStarterCode(prevEditor.language),
    }));
    setResult({
      value: "Send your code to see the result",
      color: "gray",
      testResults: [],
    });
  }, [starterCode]);

  function handleCodeChange(newValue: string | undefined) {
    if (newValue !== undefined) {
      setEditor((prevEditor) => ({ ...prevEditor, value: newValue }));
    }
  }

  function handleLanguageChange(language: (typeof challengeLanguages)[number]) {
    setEditor((prevEditor) => ({
      ...prevEditor,
      language: language.editorLanguage,
      languageId: language.id,
      value: getStarterCode(language.editorLanguage),
    }));
    setResult({
      value: "Send your code to see the result",
      color: "gray",
      testResults: [],
    });
  }

  function getStarterCode(editorLanguage: string) {
    const language = challengeLanguages.find(
      (candidate) => candidate.editorLanguage === editorLanguage,
    );

    return starterCode[editorLanguage] ?? language?.starterCode ?? "";
  }

  async function handleSubmit() {
    const sourceCode = editor.value.trim();

    if (!sourceCode) {
      setResult({
        value: "Please write code before running.",
        color: "yellow",
        testResults: [],
      });
      return;
    }

    try {
      setResult({ value: "Running tests...", color: "gray", testResults: [] });
      const response = await submitChallenge(
        challengeId,
        sourceCode,
        editor.languageId,
      );

      setResult({
        value: response.message,
        color: response.passed ? "green" : "red",
        testResults: response.results ?? [],
      });
    } catch (error) {
      console.error(error);
      setResult({
        value: "Error submitting challenge.",
        color: "red",
        testResults: [],
      });
    }
  }

  return (
    <Card className="m-2 grid">
      <Card className="m-2 flex">
        <Dropdown
          color="blue"
          className="mx-1"
          label={`Language: ${editor.language || "Select"}`}
        >
          {challengeLanguages.map((language) => (
            <Dropdown.Item
              key={language.id}
              onClick={() => handleLanguageChange(language)}
            >
              {language.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Button onClick={handleSubmit} color="blue" className="mx-1">
          Run
        </Button>
      </Card>
      <Card className="mx-2 grid grid-cols-1">
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
        <Badge className="w-fit" color={result.color}>
          {result.value}
        </Badge>
        {result.testResults.length > 0 && (
          <div className="mt-3 grid gap-2">
            {result.testResults.map((testResult) => (
              <Card
                key={testResult.test_case}
                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Badge color={testResult.passed ? "green" : "red"}>
                    Test {testResult.test_case}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {testResult.comparison}
                  </span>
                </div>
                {!testResult.passed && (
                  <div className="grid gap-1 text-sm text-gray-900 dark:text-white">
                    <p>
                      <span className="font-semibold">Expected:</span>{" "}
                      {testResult.expected}
                    </p>
                    <p>
                      <span className="font-semibold">Actual:</span>{" "}
                      {testResult.actual}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </Card>
  );
}
