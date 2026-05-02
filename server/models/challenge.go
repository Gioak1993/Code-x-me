package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestCase struct {
	Input          []any  `bson:"input" json:"input"`
	ExpectedOutput any    `bson:"expected_output" json:"expected_output"`
	Comparison     string `bson:"comparison,omitempty" json:"comparison,omitempty"`
}

type FunctionParameter struct {
	Name string `bson:"name" json:"name"`
	Type string `bson:"type" json:"type"`
}

type FunctionSignature struct {
	Name       string              `bson:"name" json:"name"`
	Parameters []FunctionParameter `bson:"parameters" json:"parameters"`
	ReturnType string              `bson:"return_type,omitempty" json:"return_type,omitempty"`
}

type ChallengeExample struct {
	Input       string `bson:"input" json:"input"`
	Output      string `bson:"output" json:"output"`
	Explanation string `bson:"explanation,omitempty" json:"explanation,omitempty"`
}

type CodeChallenge struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProblemName        string             `bson:"problem_name" json:"problem_name"`
	ProblemExplanation string             `bson:"problem_explanation" json:"problem_explanation"`
	Examples           []string           `bson:"examples" json:"examples"`
	ExampleCases       []ChallengeExample `bson:"example_cases,omitempty" json:"example_cases,omitempty"`
	StarterCode        map[string]string  `bson:"starter_code,omitempty" json:"starter_code,omitempty"`
	FunctionSignature  FunctionSignature  `bson:"function_signature,omitempty" json:"function_signature,omitempty"`
	InputsOutputs      []TestCase         `bson:"inputs_outputs" json:"inputs_outputs"`
	Constraints        string             `bson:"constraints" json:"constraints"`
	Difficulty         string             `bson:"difficulty" json:"difficulty"`
}

type CurrentSubmission struct {
	UserID      string `json:"user_id"`
	ChallengeID string `json:"challenge_id"`
	LanguageID  int    `json:"language_id"`
	SourceCode  string `json:"source_code"`
}

type RecordedSubmission struct {
	UserID         string    `json:"user_id"`
	ChallengeID    string    `json:"challenge_id"`
	LanguageID     int       `json:"language_id"`
	SourceCode     string    `json:"source_code"`
	Passed         bool      `json:"passed"`
	SubmissionTime time.Time `json:"submission_time"`
}

type ChallengeTestResult struct {
	TestCase   int    `json:"test_case"`
	Passed     bool   `json:"passed"`
	Comparison string `json:"comparison"`
	Expected   string `json:"expected"`
	Actual     string `json:"actual"`
}

type ChallengeSubmissionResult struct {
	Passed  bool                  `json:"passed"`
	Message string                `json:"message"`
	Results []ChallengeTestResult `json:"results"`
}
