package controllers

import (
	"code-x-me/server/initializers"
	"code-x-me/server/models"
	"code-x-me/server/services"
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateChallenge(c *gin.Context) {
	var challenge models.CodeChallenge

	if err := c.BindJSON(&challenge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON payload",
		})
		return
	}

	coll := initializers.DBClient.Database("codexme").Collection("challenges")
	doc := models.CodeChallenge{
		ProblemName:        challenge.ProblemName,
		ProblemExplanation: challenge.ProblemExplanation,
		Examples:           challenge.Examples,
		ExampleCases:       challenge.ExampleCases,
		StarterCode:        challenge.StarterCode,
		FunctionSignature:  challenge.FunctionSignature,
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
		return
	}

	fmt.Printf("Inserted challenge with _id: %v\n", result.InsertedID)
	c.JSON(http.StatusOK, result)
}

func GetChallenges(c *gin.Context) {
	coll := initializers.DBClient.Database("codexme").Collection("challenges")

	cursor, err := coll.Find(context.TODO(), bson.D{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error when retrieving challenges",
		})
		return
	}

	var challenges []models.CodeChallenge
	if err = cursor.All(context.Background(), &challenges); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error when decoding challenges",
		})
		return
	}

	c.JSON(http.StatusOK, challenges)
}

func GetChallenge(c *gin.Context) {
	coll := initializers.DBClient.Database("codexme").Collection("challenges")

	challengeID := c.Param("id")
	hexID, err := primitive.ObjectIDFromHex(challengeID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Challenge ID"})
		return
	}

	filter := bson.D{{Key: "_id", Value: hexID}}

	var result models.CodeChallenge
	err = coll.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "the Challenge was not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error when retrieving challenge"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func SubmitChallenge(c *gin.Context) {
	var submission models.CurrentSubmission

	if err := c.BindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	coll := initializers.DBClient.Database("codexme").Collection("challenges")

	hexchallengeID, err := primitive.ObjectIDFromHex(submission.ChallengeID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Challenge ID"})
		return
	}

	filter := bson.D{{Key: "_id", Value: hexchallengeID}}
	var challenge models.CodeChallenge

	err = coll.FindOne(context.TODO(), filter).Decode(&challenge)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "The Challenge was not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "an error was found when searching the challenge"})
		return
	}

	result, err := services.SubmitChallenge(challenge, submission)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
