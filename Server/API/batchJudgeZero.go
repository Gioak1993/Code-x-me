package api

// Batch submissions

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/tidwall/gjson"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

type BatchSubmission struct {
	Submissions []RequestsJudgeZeroApi `json:"submissions"`
}

// Define a struct to map the JSON tokens
type Token struct {
	Token string `json:"token"`
}

func (r *BatchSubmission) GetBatchToken(submissions []RequestsJudgeZeroApi) (string, error) {

	// Define the URL with query parameters

	baseURL := "https://judge0-ce.p.sulu.sh/submissions/batch"
	params := url.Values{}
	params.Add("base64_encoded", "false")
	params.Add("fields", "*")

	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	payload := BatchSubmission{Submissions: submissions}
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
	req.Header.Set("content-type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("SULUTOKEN"))

	//do the request

	resp, err := client.Do(req)

	if err != nil {
		fmt.Println("Error making the request", err)
	}
	defer resp.Body.Close()

	//Read the response

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("an error occur reading the response %s", err)
	}

	// if the status is 201, we now need to make another
	// call with the token to get the output of the code

	if resp.StatusCode == 201 {

		var tokens []Token
		err := json.Unmarshal(body, &tokens)

		if err != nil {
			return "", fmt.Errorf("an error occur when unmarshaling the body %s", err)
		}

		//iterate over the tokens to build the comma separate string

		var tokenList []string
		for _, token := range tokens {
			tokenList = append(tokenList, token.Token)
		}

		//join the token into a single string

		tokenString := strings.Join(tokenList, ",")

		return tokenString, nil //this would be used in a get requests to get the responses

	}

	return "", fmt.Errorf("an error occur did not get status code 201")
}

func (r *BatchSubmission) GetBatchResults(tokens string) (string, error) {

	// Define the url with the get request parameters
	responseURL := "https://judge0-ce.p.sulu.sh//submissions/batch?"
	params := url.Values{}
	params.Add("tokens", tokens)
	params.Add("base64_encoded", "false")
	params.Add("fields", "*")
	fullURL := fmt.Sprintf("%s?%s", responseURL, params.Encode())

	req, err := http.NewRequest("GET", fullURL, nil)
	if err != nil {
		fmt.Println("Error creating get request", err)
	}
	// Add the Headers

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+os.Getenv("SULUTOKEN"))

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

func BatchJudgeZero(batch []RequestsJudgeZeroApi) ([]map[string]interface{}, error) {

	batchJudgeApi := BatchSubmission{
		Submissions: batch,
	}

	tokens, err := batchJudgeApi.GetBatchToken(batch)
	if err != nil {
		return nil, fmt.Errorf("failed to get token: %s", err)
	}

	// usually, when you run the get request the api still has not the result ready {"stdout":"null"}
	// so you need to retry until you get the desired result,
	// lets set a max number of tries and try again until we get something

	const maxTries int = 20
	delay := 500 * time.Millisecond

	var batchresults string

out:
	for i := 1; i < maxTries; i++ {
		batchresults, err = batchJudgeApi.GetBatchResults(tokens)
		if err != nil {
			return nil, fmt.Errorf("error in batchJudgeApi.GetBatchResults(tokens)")
		}

		//here is when i want to check if the statusids is returning only 3 or 4
		// json.Get submissions.#.status_id check all the submission ids on the json,
		//if they are not 3 or 4 it would return that doesnt exists
		arrayLenght := int(gjson.Get(batchresults, "submissions.#").Int()) // the lenght of the submissions send

		//create a string that would match the expected array length for the response (ej: [3,3,3]), for example if we send
		// 3 tokens, we would expect back 3 responses, the desire submission.#.status_id would be [3,3,3]
		// check https://github.com/tidwall/gjson/blob/master/SYNTAX.md for more details

		comparableString := strings.Replace("["+strings.Repeat("3,", (arrayLenght))+"]", ",]", "]", 1)

		// this would print [3,3,3] or values >= 3 if we send 3 tokens

		//replace 1 or 2 for the arrays so it would result in empty [] or incomplete len string ej:[3,3,3] != [3,3]

		statusid := strings.Replace(gjson.Get(batchresults, "submissions.#.status_id").String(), "1", "", -1) //replace 1 for ""
		statusid = strings.Replace(statusid, "2", "", -1)                                                     //replace 2 for ""

		if len(statusid) < len(comparableString) {
			time.Sleep(delay)
			continue
		} else if len(statusid) == len(comparableString) {
			break out
			// the array lenght [3,3,3] match the desired output.
			//so judge api has accepted the token and has send back the desired response
		}
	}

	// Slice to store each submission's data
	var submissionsData []map[string]interface{}

	// Use gjson to get the "submissions" array
	submissions := gjson.Get(batchresults, "submissions")

	submissions.ForEach(func(_, submission gjson.Result) bool {
		data := make(map[string]interface{})

		// Populate the map with all key-value pairs from the JSON object
		submission.ForEach(func(key, value gjson.Result) bool {
			// Add each field dynamically
			data[key.String()] = parseGJSONValue(value)
			return true
		})

		// Add to the slice
		submissionsData = append(submissionsData, data)

		// Continue iterating
		return true
	})

	return submissionsData, nil
}

// Helper function to convert gjson.Result to native Go types
func parseGJSONValue(value gjson.Result) interface{} {
	if value.IsArray() {
		var array []interface{}
		value.ForEach(func(_, v gjson.Result) bool {
			array = append(array, parseGJSONValue(v))
			return true
		})
		return array
	} else if value.IsObject() {
		obj := make(map[string]interface{})
		value.ForEach(func(k, v gjson.Result) bool {
			obj[k.String()] = parseGJSONValue(v)
			return true
		})
		return obj
	} else if value.Type == gjson.Number {
		return value.Num
	} else if value.Type == gjson.String {
		return value.String()
	} else if value.Type == gjson.True || value.Type == gjson.False {
		return value.Bool()
	} else {
		return nil
	}
}
