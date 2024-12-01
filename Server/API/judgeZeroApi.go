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

	"github.com/joho/godotenv"
	"github.com/tidwall/gjson"
)

type JudgeZeroApi struct {
	LanguageId int    //language id from the request
	SourceCode string // source code from the user
}

func (r *JudgeZeroApi) GetToken() (string, string, error) {

	// Define the URL with query parameters

	baseURL := "https://judge0-ce.p.sulu.sh/submissions"
	params := url.Values{}
	params.Add("base64_encoded", "false")
	params.Add("fields", "*")

	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	// Prepare the JSON payload

	payload := map[string]string{
		"language_id":     strconv.Itoa(r.LanguageId),
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
	req.Header.Set("Authorization", "Bearer " + os.Getenv("SuluToken"))


	//do the request

	client := &http.Client{}
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

func (r *JudgeZeroApi) GetResults(token string) (string, error) {

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
	req.Header.Add("Authorization", "Bearer " + os.Getenv("SuluToken"))

	client := &http.Client{}
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

	// Load environment variables from the parent directory
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
		return ("Error: ")

	}
	judgeAPI := JudgeZeroApi{
		LanguageId: languageId,
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

	const maxTries int = 10
	delay := 1 * time.Second

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

		switch statusID.Int() {
		case 1, 2, 3:
			fmt.Println("Result not ready")
			time.Sleep(delay)
			continue
		case 4:

			fmt.Println(output.String())
			results := map[string]string{
				"Status":  "success",
				"Output":  output.String(),
				"Time":    executionTime.String(),
				"Memory":  memory.String(),
				"Message": "code executed successfully",
			}

			return results // when the output is ready to be shown we return the response
		default:
			time.Sleep(delay)
			continue
		}

	}
	return ("Error trying to get the output")
}
