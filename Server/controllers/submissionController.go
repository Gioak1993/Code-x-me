package controllers

import (
	"code-x-me/server/api"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestCase struct {
	Input          []interface{} `bson:"input" json:"input"` // Generic array for multiple input types
	ExpectedOutput interface{}   `bson:"expected_output" json:"expected_output"`
}

type CodeChallenge struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProblemName        string             `bson:"problem_name" json:"problem_name"`
	ProblemExplanation string             `bson:"problem_explanation" json:"problem_explanation"`
	InputsOutputs      []TestCase         `bson:"inputs" json:"inputs"` // JSON string
	Constraints        string             `bson:"constraints" json:"constraints"`
	Difficulty         string             `bson:"difficulty" json:"difficulty"`
}

type UserSubmission struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID         string             `bson:"user_id" json:"user_id"`
	ChallengeID    primitive.ObjectID `bson:"challenge_id" json:"challenge_id"`
	SourceCode     string             `bson:"source_code" json:"source_code"`
	LanguageId     int                `bson:"language_id" json:"language_id"`
	SubmissionTime primitive.DateTime `bson:"submission_time" json:"submission_time"`
	IsCorrect      bool               `bson:"is_correct" json:"is_correct"`
}

type UserSubmissionBatch struct {
	Submissions []UserSubmission `json:"submissions"`
}

func Submission(c *gin.Context) {

	var submission UserSubmission

	// Bind JSON payload to the struct

	if err := c.BindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	//log the received data
	fmt.Printf("Received: %+v\n", submission)

	// send the request to de Judge0 Api
	result := api.JudgeZero(submission.LanguageId, submission.SourceCode)

	// get the results
	c.JSON(http.StatusOK, result)

}

func SubmissionBatch(c *gin.Context) {

	var batch UserSubmissionBatch

	// Bind JSON payload to the struct

	if err := c.BindJSON(&batch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	//log the received data
	fmt.Printf("Received: %+v\n", batch)

	// Prepare the submissions for the Judge0 API
	var submissions []api.RequestsJudgeZeroApi
	for _, s := range batch.Submissions {
		submissions = append(submissions, api.RequestsJudgeZeroApi{
			LanguageID: s.LanguageId,
			SourceCode: s.SourceCode,
		})
	}

	fmt.Printf("Received: %+v\n", submissions)

	// send the request to de Judge0 Api

	results := api.BatchJudgeZero(submissions)

	// get the results
	c.JSON(http.StatusOK, results)

}
