package main

import (
	"code-x-me/server/controllers"
	"code-x-me/server/initializers"
	"code-x-me/server/middleware"
	"context"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {

	initializers.DbConnect()

}

func main() {

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Replace with your React app URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.POST("/submission", controllers.Submission)

	r.POST("/signup", controllers.SignUp)

	r.POST("/login", controllers.Login)

	r.GET("/logout", controllers.LogOut)

	r.GET("/validate", middleware.RequireAuth, controllers.Validate)

	r.POST("/batch", controllers.SubmissionBatch)

	r.GET("/challenge/:id", controllers.GetChallenge)

	r.GET("/challenges", controllers.GetChallenges)

	r.POST("/newchallenge", controllers.CreateChallenge)

	r.POST("/submitchallenge", controllers.SubmitChallenge)

	r.Run("localhost:3000") // listen and serve on 0.0.0.0:3000

	defer func() {
		if err := initializers.DBClient.Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
	}()

}
