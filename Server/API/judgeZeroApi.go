// Script to get the result of the source code send trought the JUDGE0 API

package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/tidwall/gjson"
)

var client *http.Client

func init() {
	client = &http.Client{}
}

type Status struct {
	ID          int    `json:"id"`
	Description string `json:"description"`
}

type Language struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type RequestsJudgeZeroApi struct {
	SourceCode                           string `json:"source_code"`
	LanguageID                           int    `json:"language_id"`
	CompilerOptions                      string `json:"compiler_options,omitempty"`
	CommandLineArguments                 string `json:"command_line_arguments,omitempty"`
	Stdin                                string `json:"stdin,omitempty"`
	ExpectedOutput                       string `json:"expected_output,omitempty"`
	CPUTimeLimit                         string `json:"cpu_time_limit,omitempty"`
	CPUExtraTime                         string `json:"cpu_extra_time,omitempty"`
	MemoryLimit                          int    `json:"memory_limit,omitempty"`
	StackLimit                           int    `json:"stack_limit,omitempty"`
	MaxProcessesAndOrThreads             int    `json:"max_processes_and_or_threads,omitempty"`
	EnablePerProcessAndThreadTimeLimit   bool   `json:"enable_per_process_and_thread_time_limit,omitempty"`
	EnablePerProcessAndThreadMemoryLimit bool   `json:"enable_per_process_and_thread_memory_limit,omitempty"`
	MaxFileSize                          int    `json:"max_file_size,omitempty"`
	RedirectStderrToStdout               bool   `json:"redirect_stderr_to_stdout,omitempty"`
	EnableNetwork                        bool   `json:"enable_network,omitempty"`
	NumberOfRuns                         int    `json:"number_of_runs,omitempty"`
	AdditionalFiles                      string `json:"additional_files,omitempty"`
	CallbackURL                          string `json:"callback_url,omitempty"`
	Stdout                               string `json:"stdout,omitempty"`
	Stderr                               string `json:"stderr,omitempty"`
	CompileOutput                        string `json:"compile_output,omitempty"`
	Message                              string `json:"message,omitempty"`
	ExitCode                             int    `json:"exit_code,omitempty"`
	ExitSignal                           int    `json:"exit_signal,omitempty"`
	Status                               string `json:"status,omitempty"`
	CreatedAt                            string `json:"created_at,omitempty"`
	FinishedAt                           string `json:"finished_at,omitempty"`
	Token                                string `json:"token,omitempty"`
	Time                                 string `json:"time,omitempty"`
	WallTime                             string `json:"wall_time,omitempty"`
	Memory                               int    `json:"memory,omitempty"`
}

func (r *RequestsJudgeZeroApi) GetToken() (string, string, error) {

	// Define the URL with query parameters

	baseURL := "https://judge0-ce.p.sulu.sh/submissions"
	params := url.Values{}
	params.Add("base64_encoded", "false")
	params.Add("fields", "*")

	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	// Prepare the JSON payload

	payload := map[string]string{
		"language_id":     strconv.Itoa(r.LanguageID),
		"source_code":     r.SourceCode,
		"expected_output": "null",
	}

	jsonDATA, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("Error marshaling the json", err)

	}

	// Create the post Request

	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonDATA))
	if err != nil {
		fmt.Println("Error creating request", err)
	}

	// Add Headers
	apiKey := os.Getenv("SuluToken")
	if apiKey == "" {
		fmt.Println("Api Key not set")
	}

	req.Header.Set("content-type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("SuluToken"))

	//do the request

	resp, err := client.Do(req)

	if err != nil {
		fmt.Println("Error making the request", err)
	}
	defer resp.Body.Close()

	//Read the response

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading the response:", err)
	}
	// if the status is 201, we now need to make another
	// call with the token to get the output of the code
	if resp.Status == "201 Created" {
		responseData := string(body)
		token := gjson.Get(responseData, "token")

		return resp.Status, token.String(), nil

	}
	return resp.Status, string(body), nil
}

func (r *RequestsJudgeZeroApi) GetResults(token string) (string, error) {

	// Define the url with the get request parameters
	responseURL := "https://judge0-ce.p.sulu.sh//submissions/" + token
	params := url.Values{}
	params.Add("base64_encoded", "false")
	params.Add("fields", "*")
	fullURL := fmt.Sprintf("%s?%s", responseURL, params.Encode())

	req, err := http.NewRequest("GET", fullURL, nil)
	if err != nil {
		fmt.Println("Error creating get request", err)
	}
	// Add the Headers

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+os.Getenv("SuluToken"))

	resp, err := client.Do(req)

	if err != nil {
		fmt.Println("Error making the get request", err)
	}
	defer resp.Body.Close()

	//Read the response

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading the response:", err)

	}

	return string(body), nil
}

func JudgeZero(languageId int, sourceCode string) interface{} {

	judgeAPI := RequestsJudgeZeroApi{
		LanguageID: languageId,
		SourceCode: sourceCode,
	}

	status, token, err := judgeAPI.GetToken()
	if err != nil {
		fmt.Println("Error:", err)
	}
	fmt.Println(status, token)

	// usually, when you run the get request the api still has not the result ready {"stdout":"null"}
	// so you need to retry until you get the desired result,
	// lets set a max number of tries and try again until we get something

	const maxTries int = 100
	delay := 10 * time.Millisecond

	//we use this label to break the loop on the desired condition
	for i := 1; i < maxTries; i++ {
		result, err := judgeAPI.GetResults(token)
		if err != nil {
			fmt.Println("Get this error when retrieving results:", err)
		}
		statusID := gjson.Get(result, "status.id")
		output := gjson.Get(result, "stdout")
		executionTime := gjson.Get(result, "time")
		memory := gjson.Get(result, "memory")
		expected_output := gjson.Get(result, "expected_output")

		switch statusID.Int() {
		case 1, 2:
			fmt.Println("Result not ready")
			time.Sleep(delay)
			continue
		case 3, 4:
			fmt.Println(output.String())
			results := map[string]string{
				"Status":         "success",
				"Output":         output.String(),
				"Time":           executionTime.String(),
				"Memory":         memory.String(),
				"Message":        "code executed successfully",
				"ExpectedOutput": expected_output.String(),
			}
			fmt.Println(result)
			return results // when the output is ready to be shown we return the response
		default:
			time.Sleep(delay)
			continue
		}

	}
	return ("Error trying to get the output")
}
