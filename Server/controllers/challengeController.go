package controllers

import (
	"code-x-me/server/initializers"
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/bson"

	"go.mongodb.org/mongo-driver/mongo"
)

func CreateChallenge(c *gin.Context) {

	var challenge CodeChallenge

	if err := c.BindJSON(&challenge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ivalid JSON payload",
		})
		return
	}

	coll := initializers.DBClient.Database("codexme").Collection("challenges")
	doc := CodeChallenge{ProblemName: challenge.ProblemName,
		ProblemExplanation: challenge.ProblemExplanation,
		InputsOutputs:      challenge.InputsOutputs,
		Constraints:        challenge.Constraints,
		Difficulty:         challenge.Difficulty,
	}

	result, err := coll.InsertOne(context.TODO(), doc)
	if err != nil {
		fmt.Println("error when inserting challenge", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error when inserting challenge",
		})
	}

	fmt.Printf("Inserted challenge with _id: %v\n", result.InsertedID)
	c.JSON(http.StatusOK, result)

}

func SubmitChallenge(c *gin.Context) {

	// received the json from the user submission
	var submission UserSubmission

	if err := c.BindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ivalid JSON payload",
		})
		return
	}

	//find the challenge on the database if not find return the bad request

	coll := initializers.DBClient.Database("codexme").Collection("challenges")

	filter := bson.D{{Key: "challenge_id", Value: submission.ChallengeID}}

	var result CodeChallenge
	err := coll.FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"error": "the Challenge was not found"})
			return
		}
		panic(err)
	}
}
