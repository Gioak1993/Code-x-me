package main

import (
	"fmt"
	"net/http"

	"github.com/Gioak1993/Code-x-me/api"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CodeSubmission struct {
	SourceCode string `json:"source_code"`
	LanguageId int    `json:"language_id"`
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, // Replace with your React app URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

	r.GET("/ping", func(c *gin.Context) {

		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST("/submissionn", func(c *gin.Context) {
		var submission CodeSubmission

		// Bind JSON payload to the struct

		if err := c.BindJSON(&submission); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
			return
		}

		//log the received data
		fmt.Printf("Received: %+v\n", submission)
		result := api.JudgeZero(submission.LanguageId, submission.SourceCode)

		c.JSON(http.StatusOK, result)

	})

	r.Run("localhost:8080") // listen and serve on 0.0.0.0:8080
}
