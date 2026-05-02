package main

import (
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestSetupRouterRegistersExpectedRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := SetupRouter()

	expectedRoutes := map[string]bool{
		"POST /submission":      false,
		"POST /signup":          false,
		"POST /login":           false,
		"GET /logout":           false,
		"GET /validate":         false,
		"POST /batch":           false,
		"GET /challenge/:id":    false,
		"GET /challenges":       false,
		"POST /newchallenge":    false,
		"POST /submitchallenge": false,
	}

	for _, route := range router.Routes() {
		key := route.Method + " " + route.Path
		if _, ok := expectedRoutes[key]; ok {
			expectedRoutes[key] = true
		}
	}

	for route, found := range expectedRoutes {
		if !found {
			t.Fatalf("expected route %s to be registered", route)
		}
	}
}

func TestSetupRouterHandlesUnknownRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := SetupRouter()
	response := performRequest(router, http.MethodGet, "/does-not-exist")

	if response.Code != http.StatusNotFound {
		t.Fatalf("expected status %d, got %d", http.StatusNotFound, response.Code)
	}
}
