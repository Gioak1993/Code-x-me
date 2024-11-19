// Script to get the result of the source code send trought the JUDGE0 API

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)


type JudgeZeroApi struct {

	LanguageId int 
	SourceCode string
}
func (r *JudgeZeroApi) GetToken () (string, string, error) {

	// Define the URL with query parameters
	
	baseURL := "https://judge0-ce.p.rapidapi.com/submissions"
	params := url.Values{}
	params.Add("base64_encoded","false")
	params.Add("fields","*")
	
	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	// Prepare the JSON payload

	payload := map[string]string {
		"language_id": strconv.Itoa(r.LanguageId),
		"source_code": r.SourceCode,
		"callback_url": "https://codexme.reflex.run/",
		"expected_output": "null",
	}

	jsonDATA, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("Error marshaling the json", err)
		
	}

	// Create de Request

	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonDATA))
	if err != nil {
		fmt.Println("Error creating request", err)
	}

	// Add Headers
	apiKey := os.Getenv("RapidAPI_Key")
	if apiKey == "" {
		fmt.Println("Api Key not set")
	}
	
	req.Header.Set("content-type", "application/json")
	req.Header.Set("X-RapidAPI-Key", os.Getenv("RapidAPI_Key"))
	req.Header.Set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com")
	
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

	return resp.Status, string(body), nil
}


func main (){
	
	// Load environment variables from the parent directory
	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
		return
	}
	judgeAPI := JudgeZeroApi{
		LanguageId: 92,
		SourceCode: "print('hello world)",
	}

	status, response, err := judgeAPI.GetToken()
	if err != nil {
		fmt.Println("Error:", err)
	}
	fmt.Println("Status:", status)
	fmt.Println("API Response:", response)

}