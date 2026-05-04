import { Editor } from "@monaco-editor/react";
import { Badge, Button, Dropdown, useThemeMode } from "flowbite-react";
import { useEffect, useState } from "react";
import submitChallenge from "../api/submitChallenge.ts";
import type { ChallengeTestResult } from "../api/submitChallenge.ts";
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

  const passedTests = result.testResults.filter((testResult) => testResult.passed);
  const failedTests = result.testResults.filter((testResult) => !testResult.passed);

  return (
    <Card className="mt-4 flex flex-col gap-4">
      <Card className="flex h-fit items-start gap-2">
        <Dropdown
          color="blue"
          className="h-fit"
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
        <Button onClick={handleSubmit} color="blue" className="h-fit">
          Run
        </Button>
      </Card>
      <Card className="grid grid-cols-1 gap-3">
        <Card className="grid grid-cols-1 gap-2">
          <span className="bg-white text-2xl font-light tracking-tight text-gray-900 dark:bg-gray-900 dark:text-white">
            Input
          </span>
          <Editor
            className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            height="320px"
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
          <div className="mt-3 grid gap-3">
            {failedTests.length === 0 ? (
              <Card className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  All {result.testResults.length} tests passed.
                </p>
              </Card>
            ) : (
              <>
                {passedTests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {passedTests.map((testResult) => (
                      <Badge key={testResult.test_case} color="green">
                        Test {testResult.test_case}
                      </Badge>
                    ))}
                  </div>
                )}
                {failedTests.map((testResult) => (
                  <Card
                    key={testResult.test_case}
                    className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Badge color="red">Test {testResult.test_case}</Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {testResult.comparison}
                      </span>
                    </div>
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
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </Card>
    </Card>
  );
}
