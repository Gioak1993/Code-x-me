package controllers

import (
	"code-x-me/server/api"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

)

func Submission(c *gin.Context) {

	var submission api.RequestsJudgeZeroApi

	// Bind JSON payload to the struct

	if err := c.BindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	//log the received data
	fmt.Printf("Received: %+v\n", submission)

	// send the request to de Judge0 Api
	result := api.JudgeZero(submission.LanguageID, submission.SourceCode)

	// get the results
	c.JSON(http.StatusOK, result)

}

func SubmissionBatch(c *gin.Context) {

	var batch api.BatchSubmission

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
			SourceCode:                           s.SourceCode,
			LanguageID:                           s.LanguageID,
			CompilerOptions:                      s.CompilerOptions,
			CommandLineArguments:                 s.CommandLineArguments,
			Stdin:                                s.Stdin,
			ExpectedOutput:                       s.ExpectedOutput,
			CPUTimeLimit:                         s.CPUTimeLimit,
			CPUExtraTime:                         s.CPUExtraTime,
			WallTimeLimit:                        s.WallTimeLimit,
			MemoryLimit:                          s.MemoryLimit,
			StackLimit:                           s.StackLimit,
			MaxProcessesAndOrThreads:             s.MaxProcessesAndOrThreads,
			EnablePerProcessAndThreadTimeLimit:   s.EnablePerProcessAndThreadTimeLimit,
			EnablePerProcessAndThreadMemoryLimit: s.EnablePerProcessAndThreadMemoryLimit,
			MaxFileSize:                          s.MaxFileSize,
			RedirectStderrToStdout:               s.RedirectStderrToStdout,
			EnableNetwork:                        s.EnableNetwork,
			NumberOfRuns:                         s.NumberOfRuns,
			AdditionalFiles:                      s.AdditionalFiles,
			CallbackURL:                          s.CallbackURL,
		})
	}

	fmt.Printf("Received: %+v\n", submissions)

	// send the request to de Judge0 Api

	results := api.BatchJudgeZero(submissions)

	// get the results
	c.JSON(http.StatusOK, results)

}
