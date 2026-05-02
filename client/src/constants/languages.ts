export type Language = {
  name: string;
  id: number;
  editorLanguage: string;
  starterCode?: string;
};

export const playgroundLanguages: Language[] = [
  { name: "Python", id: 92, editorLanguage: "python" },
  { name: "Javascript", id: 93, editorLanguage: "javascript" },
  { name: "TypeScript", id: 94, editorLanguage: "typescript" },
  { name: "Swift", id: 83, editorLanguage: "swift" },
  { name: "Assembly", id: 45, editorLanguage: "asm" },
  { name: "Bash", id: 46, editorLanguage: "shell" },
  { name: "C", id: 75, editorLanguage: "c" },
  { name: "C++", id: 76, editorLanguage: "cpp" },
  { name: "C#", id: 51, editorLanguage: "csharp" },
  { name: "COBOL", id: 77, editorLanguage: "cobol" },
  { name: "D", id: 56, editorLanguage: "d" },
  { name: "Dart", id: 90, editorLanguage: "dart" },
  { name: "Elixir", id: 57, editorLanguage: "elixir" },
  { name: "Erlang", id: 58, editorLanguage: "erlang" },
  { name: "F#", id: 87, editorLanguage: "fsharp" },
  { name: "Fortran", id: 59, editorLanguage: "fortran" },
  { name: "Go", id: 95, editorLanguage: "go" },
  { name: "Groovy", id: 88, editorLanguage: "groovy" },
  { name: "Haskell", id: 61, editorLanguage: "haskell" },
  { name: "Kotlin", id: 78, editorLanguage: "kotlin" },
  { name: "Lua", id: 64, editorLanguage: "lua" },
  { name: "Objective-C", id: 79, editorLanguage: "objective-c" },
  { name: "Octave", id: 66, editorLanguage: "octave" },
  { name: "Perl", id: 85, editorLanguage: "perl" },
  { name: "R", id: 80, editorLanguage: "r" },
  { name: "Ruby", id: 72, editorLanguage: "ruby" },
  { name: "Scala", id: 81, editorLanguage: "scala" },
];

export const challengeLanguages: Language[] = [
  {
    name: "Python",
    id: 92,
    editorLanguage: "python",
    starterCode: `def solution():\n    # Write your solution here\n    pass`,
  },
  {
    name: "Javascript",
    id: 93,
    editorLanguage: "javascript",
    starterCode: `function solution() {\n    // Write your solution here\n}`,
  },
  {
    name: "TypeScript",
    id: 94,
    editorLanguage: "typescript",
    starterCode: `function solution(): void {\n    // Write your solution here\n}`,
  },
];
