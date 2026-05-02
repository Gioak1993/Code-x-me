package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestJudgeZeroClientGetTokenUsesConfiguredServer(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("expected POST request, got %s", r.Method)
		}
		if r.URL.Path != "/submissions" {
			t.Fatalf("expected /submissions path, got %s", r.URL.Path)
		}
		if got := r.Header.Get("x-rapidapi-key"); got != "test-key" {
			t.Fatalf("expected API key header test-key, got %s", got)
		}

		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			t.Fatalf("decode request body: %v", err)
		}
		if got := payload["source_code"]; got != "print('hello')" {
			t.Fatalf("expected source_code print('hello'), got %v", got)
		}

		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte(`{"token":"abc123"}`))
	}))
	defer server.Close()

	client := NewJudgeZeroClient(server.URL, server.Client(), "test-key")

	status, token, err := client.GetToken(RequestsJudgeZeroApi{
		LanguageID: 71,
		SourceCode: "print('hello')",
	})

	if err != nil {
		t.Fatalf("GetToken returned error: %v", err)
	}
	if status != "201 Created" {
		t.Fatalf("expected status 201 Created, got %s", status)
	}
	if token != "abc123" {
		t.Fatalf("expected token abc123, got %s", token)
	}
}

func TestJudgeZeroClientJudgeZeroUsesConfiguredServer(t *testing.T) {
	var resultRequests int

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/submissions":
			w.WriteHeader(http.StatusCreated)
			_, _ = w.Write([]byte(`{"token":"abc123"}`))
		case "/submissions/abc123":
			resultRequests++
			_, _ = w.Write([]byte(`{
				"status": {"id": 4},
				"stdout": "hello\n",
				"time": "0.01",
				"memory": 1024,
				"expected_output": "hello",
				"compile_output": null
			}`))
		default:
			t.Fatalf("unexpected path %s", r.URL.Path)
		}
	}))
	defer server.Close()

	client := NewJudgeZeroClient(server.URL, server.Client(), "test-key")

	result := client.JudgeZero(71, "print('hello')")
	resultMap, ok := result.(map[string]string)
	if !ok {
		t.Fatalf("expected map[string]string result, got %T: %v", result, result)
	}

	if resultRequests != 1 {
		t.Fatalf("expected 1 result request, got %d", resultRequests)
	}
	if resultMap["status"] != "4" {
		t.Fatalf("expected status 4, got %s", resultMap["status"])
	}
	if resultMap["output"] != "hello\n" {
		t.Fatalf("expected output hello newline, got %q", resultMap["output"])
	}
}
