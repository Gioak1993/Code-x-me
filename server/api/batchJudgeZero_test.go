package api

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestJudgeZeroClientBatchJudgeZeroUsesConfiguredServer(t *testing.T) {
	var tokenRequestSeen bool
	var resultRequestSeen bool

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/submissions/batch" {
			t.Fatalf("expected /submissions/batch path, got %s", r.URL.Path)
		}
		if got := r.Header.Get("x-rapidapi-key"); got != "test-key" {
			t.Fatalf("expected RapidAPI key header, got %s", got)
		}
		if got := r.Header.Get("x-rapidapi-host"); got != "judge0-ce.p.rapidapi.com" {
			t.Fatalf("expected RapidAPI host header, got %s", got)
		}

		switch r.Method {
		case http.MethodPost:
			tokenRequestSeen = true
			w.WriteHeader(http.StatusCreated)
			_, _ = w.Write([]byte(`[{"token":"token-1"},{"token":"token-2"}]`))
		case http.MethodGet:
			resultRequestSeen = true
			if got := r.URL.Query().Get("tokens"); got != "token-1,token-2" {
				t.Fatalf("expected token query token-1,token-2, got %s", got)
			}
			_, _ = w.Write([]byte(`{
				"submissions": [
					{"token":"token-1","status_id":3,"stdout":"one\n","expected_output":"one"},
					{"token":"token-2","status_id":3,"stdout":"two\n","expected_output":"two"}
				]
			}`))
		default:
			t.Fatalf("unexpected method %s", r.Method)
		}
	}))
	defer server.Close()

	client := NewJudgeZeroClient(server.URL+"/", server.Client(), "test-key")

	results, err := client.BatchJudgeZero([]RequestsJudgeZeroApi{
		{LanguageID: 71, SourceCode: "print('one')"},
		{LanguageID: 71, SourceCode: "print('two')"},
	})

	if err != nil {
		t.Fatalf("BatchJudgeZero returned error: %v", err)
	}
	if !tokenRequestSeen {
		t.Fatal("expected token request to be made")
	}
	if !resultRequestSeen {
		t.Fatal("expected result request to be made")
	}
	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %d", len(results))
	}
	if strings.TrimSpace(results[0]["stdout"].(string)) != "one" {
		t.Fatalf("expected first stdout one, got %v", results[0]["stdout"])
	}
	if strings.TrimSpace(results[1]["stdout"].(string)) != "two" {
		t.Fatalf("expected second stdout two, got %v", results[1]["stdout"])
	}
}
