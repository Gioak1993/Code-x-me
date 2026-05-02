package services

import (
	"code-x-me/server/api"
	"code-x-me/server/models"
	"encoding/json"
	"fmt"
	"math"
	"reflect"
	"sort"
	"strconv"
	"strings"
)

const (
	comparisonExact          = "exact"
	comparisonTrimmed        = "trimmed"
	comparisonNumber         = "number"
	comparisonFloatTolerance = "float_tolerance"
	comparisonDeepEqual      = "deep_equal"
	comparisonUnorderedArray = "unordered_array"
)

var supportedChallengeLanguages = map[int]bool{
	92: true, // Python
	93: true, // JavaScript
	94: true, // TypeScript
}

var languageTemplates = map[int]string{
	92: `print(%s(%s))`,        // Python
	93: `console.log(%s(%s));`, // JavaScript
	94: `console.log(%s(%s));`, // TypeScript
}

func BuildExecutionCode(languageID int, sourceCode string, inputs []any) string {
	return BuildExecutionCodeWithSignature(languageID, sourceCode, inputs, models.FunctionSignature{})
}

func BuildExecutionCodeWithSignature(languageID int, sourceCode string, inputs []any, signature models.FunctionSignature) string {
	inputStr := formatInputs(languageID, inputs)
	functionName := functionName(signature)

	template, found := languageTemplates[languageID]
	if found {
		return fmt.Sprintf("\n%s\n%s\n", sourceCode, fmt.Sprintf(template, functionName, inputStr))
	}

	return fmt.Sprintf("%s\n// Execute %s with inputs: %s", sourceCode, functionName, inputStr)
}

func formatInputs(languageID int, inputs []any) string {
	formattedInputs := make([]string, 0, len(inputs))
	for _, input := range inputs {
		formattedInputs = append(formattedInputs, formatLiteral(languageID, input))
	}

	return strings.Join(formattedInputs, ",")
}

func formatLiteral(languageID int, value any) string {
	if languageID == 92 {
		return formatPythonLiteral(value)
	}

	return formatJSONLiteral(value)
}

func formatJSONLiteral(value any) string {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return strconv.Quote(fmt.Sprintf("%v", value))
	}

	return string(jsonValue)
}

func formatPythonLiteral(value any) string {
	if value == nil {
		return "None"
	}

	switch typedValue := value.(type) {
	case string:
		return strconv.Quote(typedValue)
	case bool:
		if typedValue {
			return "True"
		}
		return "False"
	case []any:
		return formatPythonSlice(typedValue)
	case map[string]any:
		return formatPythonMap(typedValue)
	}

	reflectedValue := reflect.ValueOf(value)
	switch reflectedValue.Kind() {
	case reflect.Slice, reflect.Array:
		items := make([]any, 0, reflectedValue.Len())
		for i := 0; i < reflectedValue.Len(); i++ {
			items = append(items, reflectedValue.Index(i).Interface())
		}
		return formatPythonSlice(items)
	case reflect.Map:
		items := make(map[string]any, reflectedValue.Len())
		for _, key := range reflectedValue.MapKeys() {
			items[fmt.Sprintf("%v", key.Interface())] = reflectedValue.MapIndex(key).Interface()
		}
		return formatPythonMap(items)
	default:
		return fmt.Sprintf("%v", value)
	}
}

func formatPythonSlice(values []any) string {
	formattedValues := make([]string, 0, len(values))
	for _, value := range values {
		formattedValues = append(formattedValues, formatPythonLiteral(value))
	}

	return "[" + strings.Join(formattedValues, ",") + "]"
}

func formatPythonMap(values map[string]any) string {
	keys := make([]string, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	formattedValues := make([]string, 0, len(values))
	for _, key := range keys {
		formattedValues = append(
			formattedValues,
			fmt.Sprintf("%s:%s", strconv.Quote(key), formatPythonLiteral(values[key])),
		)
	}

	return "{" + strings.Join(formattedValues, ",") + "}"
}

func SubmitChallenge(challenge models.CodeChallenge, submission models.CurrentSubmission) (models.ChallengeSubmissionResult, error) {
	if !supportedChallengeLanguages[submission.LanguageID] {
		return models.ChallengeSubmissionResult{}, fmt.Errorf("unsupported challenge language id %d", submission.LanguageID)
	}

	testSubmissions := make([]api.RequestsJudgeZeroApi, 0, len(challenge.InputsOutputs))

	for index, testCase := range challenge.InputsOutputs {
		if err := validateTestCaseInputCount(challenge.FunctionSignature, testCase, index); err != nil {
			return models.ChallengeSubmissionResult{}, err
		}

		sourceCode := BuildExecutionCodeWithSignature(
			submission.LanguageID,
			submission.SourceCode,
			testCase.Input,
			challenge.FunctionSignature,
		)

		testSubmissions = append(testSubmissions, api.RequestsJudgeZeroApi{
			SourceCode:     sourceCode,
			LanguageID:     submission.LanguageID,
			ExpectedOutput: displayValue(testCase.ExpectedOutput),
		})
	}

	results, err := api.BatchJudgeZero(testSubmissions)
	if err != nil {
		return models.ChallengeSubmissionResult{}, fmt.Errorf("submit challenge to judge0: %w", err)
	}

	return compareChallengeResults(results, challenge.InputsOutputs), nil
}

func functionName(signature models.FunctionSignature) string {
	if strings.TrimSpace(signature.Name) == "" {
		return "solution"
	}

	return strings.TrimSpace(signature.Name)
}

func validateTestCaseInputCount(signature models.FunctionSignature, testCase models.TestCase, index int) error {
	if len(signature.Parameters) == 0 {
		return nil
	}

	if len(testCase.Input) != len(signature.Parameters) {
		return fmt.Errorf(
			"test case %d has %d inputs but function signature expects %d parameters",
			index+1,
			len(testCase.Input),
			len(signature.Parameters),
		)
	}

	return nil
}

func compareChallengeResults(results []map[string]any, testCases []models.TestCase) models.ChallengeSubmissionResult {
	response := models.ChallengeSubmissionResult{
		Passed:  true,
		Message: "Challenge completed successfully",
		Results: make([]models.ChallengeTestResult, 0, len(results)),
	}

	for index, result := range results {
		expectedValue := result["expected_output"]
		comparison := comparisonTrimmed
		if index < len(testCases) {
			expectedValue = testCases[index].ExpectedOutput
			if testCases[index].Comparison != "" {
				comparison = strings.ToLower(testCases[index].Comparison)
			}
		}

		expected := displayValue(expectedValue)
		actual := strings.TrimSpace(stringValue(result["stdout"]))

		if compileOutput := stringValue(result["compile_output"]); compileOutput != "" {
			actual += compileOutput
		}

		passed := compareOutput(comparison, expectedValue, actual)
		testResult := models.ChallengeTestResult{
			TestCase:   index + 1,
			Passed:     passed,
			Comparison: comparison,
			Expected:   expected,
			Actual:     actual,
		}

		if !testResult.Passed {
			response.Passed = false
			response.Message = "Challenge failed"
		}

		response.Results = append(response.Results, testResult)
	}

	return response
}

func compareOutput(comparison string, expected any, actual string) bool {
	switch comparison {
	case comparisonExact:
		return displayValue(expected) == actual
	case comparisonNumber:
		return compareNumbers(expected, actual, 0)
	case comparisonFloatTolerance:
		return compareNumbers(expected, actual, 0.000001)
	case comparisonDeepEqual:
		return compareDeepEqual(expected, actual)
	case comparisonUnorderedArray:
		return compareUnorderedArray(expected, actual)
	case comparisonTrimmed, "":
		return strings.TrimSpace(displayValue(expected)) == strings.TrimSpace(actual)
	default:
		return strings.TrimSpace(displayValue(expected)) == strings.TrimSpace(actual)
	}
}

func compareNumbers(expected any, actual string, tolerance float64) bool {
	expectedNumber, err := numberValue(expected)
	if err != nil {
		return false
	}

	actualNumber, err := strconv.ParseFloat(strings.TrimSpace(actual), 64)
	if err != nil {
		return false
	}

	return math.Abs(expectedNumber-actualNumber) <= tolerance
}

func compareDeepEqual(expected any, actual string) bool {
	normalizedExpected, err := normalizeExpectedJSON(expected)
	if err != nil {
		return false
	}

	normalizedActual, err := normalizeActualJSON(actual)
	if err != nil {
		return false
	}

	return reflect.DeepEqual(normalizedExpected, normalizedActual)
}

func compareUnorderedArray(expected any, actual string) bool {
	normalizedExpected, err := normalizeExpectedJSON(expected)
	if err != nil {
		return false
	}

	normalizedActual, err := normalizeActualJSON(actual)
	if err != nil {
		return false
	}

	expectedItems, ok := normalizedExpected.([]any)
	if !ok {
		return false
	}

	actualItems, ok := normalizedActual.([]any)
	if !ok {
		return false
	}

	if len(expectedItems) != len(actualItems) {
		return false
	}

	sortCanonical(expectedItems)
	sortCanonical(actualItems)

	return reflect.DeepEqual(expectedItems, actualItems)
}

func numberValue(value any) (float64, error) {
	switch typedValue := value.(type) {
	case int:
		return float64(typedValue), nil
	case int32:
		return float64(typedValue), nil
	case int64:
		return float64(typedValue), nil
	case float32:
		return float64(typedValue), nil
	case float64:
		return typedValue, nil
	case string:
		return strconv.ParseFloat(strings.TrimSpace(typedValue), 64)
	default:
		return 0, fmt.Errorf("unsupported number type %T", value)
	}
}

func normalizeExpectedJSON(value any) (any, error) {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return nil, err
	}

	var normalized any
	if err := json.Unmarshal(jsonValue, &normalized); err != nil {
		return nil, err
	}

	return normalized, nil
}

func normalizeActualJSON(value string) (any, error) {
	var normalized any
	if err := json.Unmarshal([]byte(strings.TrimSpace(value)), &normalized); err != nil {
		return nil, err
	}

	return normalized, nil
}

func sortCanonical(values []any) {
	sort.Slice(values, func(i int, j int) bool {
		return canonicalJSON(values[i]) < canonicalJSON(values[j])
	})
}

func canonicalJSON(value any) string {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Sprintf("%v", value)
	}

	return string(jsonValue)
}

func displayValue(value any) string {
	if value == nil {
		return ""
	}

	if text, ok := value.(string); ok {
		return text
	}

	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Sprintf("%v", value)
	}

	return string(jsonValue)
}

func stringValue(value any) string {
	if value == nil {
		return ""
	}

	if text, ok := value.(string); ok {
		return text
	}

	return fmt.Sprintf("%v", value)
}
