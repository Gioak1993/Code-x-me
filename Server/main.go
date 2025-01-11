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

	// port := os.Getenv("PORT")              // Set to 4000 for development
	// env := os.Getenv("ENVIRONMENT")        // "development" or "production"
	// certFile := os.Getenv("SSL_CERT_FILE") // Path to SSL cert (only in production)
	// keyFile := os.Getenv("SSL_KEY_FILE")   // Path to SSL key (only in production)

	r := gin.Default()

	r.Use(cors.New(cors.Config{

		AllowOrigins:     []string{"http://nginx:5173", "http://localhost:5173", "http://codexme.net"},
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

	// // Start the server
	// log.Printf("Starting server in %s mode on port %s...", env, port)
	// if env == "production" {
	// 	if certFile == "" || keyFile == "" {
	// 		log.Fatal("SSL_CERT_FILE and SSL_KEY_FILE must be set in production")
	// 	}
	// 	log.Fatal(r.RunTLS(":"+port, certFile, keyFile))
	// } else {
	log.Fatal(r.Run(":4000"))
	// }

	defer func() {
		if err := initializers.DBClient.Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
	}()

}
