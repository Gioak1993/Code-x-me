package services

import (
	"code-x-me/server/models"
	"strings"
	"testing"
)

func TestBuildExecutionCodeUsesLanguageTemplate(t *testing.T) {
	code := BuildExecutionCode(92, "def solution(a, b):\n    return a + b", []any{1, 2})

	if !strings.Contains(code, "def solution(a, b):") {
		t.Fatalf("expected source code to be included, got %s", code)
	}
	if !strings.Contains(code, "print(solution(1,2))") {
		t.Fatalf("expected Python execution wrapper, got %s", code)
	}
}

func TestBuildExecutionCodeUsesFunctionSignatureName(t *testing.T) {
	code := BuildExecutionCodeWithSignature(
		92,
		"def add(a, b):\n    return a + b",
		[]any{1, 2},
		models.FunctionSignature{Name: "add"},
	)

	if !strings.Contains(code, "print(add(1,2))") {
		t.Fatalf("expected wrapper to use function signature name, got %s", code)
	}
}

func TestBuildExecutionCodeFormatsPythonLiterals(t *testing.T) {
	code := BuildExecutionCode(
		92,
		"def solution(text, values, meta, enabled, missing):\n    return text",
		[]any{
			"hello",
			[]any{1, "two"},
			map[string]any{"count": 2, "name": "gio"},
			true,
			nil,
		},
	)

	expectedCall := `print(solution("hello",[1,"two"],{"count":2,"name":"gio"},True,None))`
	if !strings.Contains(code, expectedCall) {
		t.Fatalf("expected Python literals in call %s, got %s", expectedCall, code)
	}
}

func TestBuildExecutionCodeFormatsJavaScriptLiterals(t *testing.T) {
	code := BuildExecutionCode(
		93,
		"function solution(text, values, meta, enabled, missing) { return text; }",
		[]any{
			"hello",
			[]any{1, "two"},
			map[string]any{"count": 2, "name": "gio"},
			true,
			nil,
		},
	)

	expectedCall := `const __codexme_result = solution("hello",[1,"two"],{"count":2,"name":"gio"},true,null);`
	if !strings.Contains(code, expectedCall) {
		t.Fatalf("expected JavaScript literals in call %s, got %s", expectedCall, code)
	}

	if !strings.Contains(code, `JSON.stringify(__codexme_result)`) {
		t.Fatalf("expected JavaScript wrapper to stringify object results, got %s", code)
	}
}

func TestBuildExecutionCodeFormatsTypeScriptWithJSONStringifyWrapper(t *testing.T) {
	code := BuildExecutionCode(
		94,
		"function solution(nums: number[]): number[] { return nums; }",
		[]any{[]any{1, 2, 3}},
	)

	expectedCall := `const __codexme_result = solution([1,2,3]);`
	if !strings.Contains(code, expectedCall) {
		t.Fatalf("expected TypeScript literals in call %s, got %s", expectedCall, code)
	}

	if !strings.Contains(code, `JSON.stringify(__codexme_result)`) {
		t.Fatalf("expected TypeScript wrapper to stringify object results, got %s", code)
	}
}

func TestCompareChallengeResultsReturnsPassedResponse(t *testing.T) {
	response := compareChallengeResults(
		[]map[string]any{
			{
				"expected_output": "4",
				"stdout":          "4\n",
				"compile_output":  nil,
			},
		},
		[]models.TestCase{{ExpectedOutput: "4"}},
	)

	if !response.Passed {
		t.Fatal("expected challenge to pass")
	}
	if response.Message != "Challenge completed successfully" {
		t.Fatalf("unexpected message %q", response.Message)
	}
	if len(response.Results) != 1 || !response.Results[0].Passed {
		t.Fatalf("expected one passing test result, got %+v", response.Results)
	}
}

func TestCompareChallengeResultsReturnsFailedResponse(t *testing.T) {
	response := compareChallengeResults(
		[]map[string]any{
			{
				"expected_output": "9",
				"stdout":          "8\n",
				"compile_output":  nil,
			},
		},
		[]models.TestCase{{ExpectedOutput: "9"}},
	)

	if response.Passed {
		t.Fatal("expected challenge to fail")
	}
	if response.Message != "Challenge failed" {
		t.Fatalf("unexpected message %q", response.Message)
	}
	if len(response.Results) != 1 || response.Results[0].Passed {
		t.Fatalf("expected one failing test result, got %+v", response.Results)
	}
}

func TestCompareChallengeResultsSupportsNumberComparison(t *testing.T) {
	response := compareChallengeResults(
		[]map[string]any{
			{
				"stdout":         "4.0\n",
				"compile_output": nil,
			},
		},
		[]models.TestCase{{ExpectedOutput: 4, Comparison: "number"}},
	)

	if !response.Passed {
		t.Fatalf("expected number comparison to pass, got %+v", response.Results)
	}
}

func TestCompareChallengeResultsSupportsDeepEqualComparison(t *testing.T) {
	response := compareChallengeResults(
		[]map[string]any{
			{
				"stdout":         `{"name":"gio","scores":[1,2]}`,
				"compile_output": nil,
			},
		},
		[]models.TestCase{
			{
				ExpectedOutput: map[string]any{
					"name":   "gio",
					"scores": []any{1, 2},
				},
				Comparison: "deep_equal",
			},
		},
	)

	if !response.Passed {
		t.Fatalf("expected deep equal comparison to pass, got %+v", response.Results)
	}
}

func TestCompareChallengeResultsSupportsUnorderedArrayComparison(t *testing.T) {
	response := compareChallengeResults(
		[]map[string]any{
			{
				"stdout":         `[3,1,2]`,
				"compile_output": nil,
			},
		},
		[]models.TestCase{
			{
				ExpectedOutput: []any{1, 2, 3},
				Comparison:     "unordered_array",
			},
		},
	)

	if !response.Passed {
		t.Fatalf("expected unordered array comparison to pass, got %+v", response.Results)
	}
}

func TestValidateTestCaseInputCountUsesFunctionSignature(t *testing.T) {
	err := validateTestCaseInputCount(
		models.FunctionSignature{
			Name: "add",
			Parameters: []models.FunctionParameter{
				{Name: "a", Type: "number"},
				{Name: "b", Type: "number"},
			},
		},
		models.TestCase{Input: []any{1}},
		0,
	)

	if err == nil {
		t.Fatal("expected input count validation to fail")
	}
}
