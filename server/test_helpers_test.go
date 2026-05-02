package main

import (
	"net/http/httptest"

	"github.com/gin-gonic/gin"
)

func performRequest(router *gin.Engine, method string, path string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(method, path, nil)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	return response
}
