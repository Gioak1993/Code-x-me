package data

import (
	"fmt"
	"os"
	"context"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)
  
func DbConnect() string {

	// Load the envitomental variables
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
		return ("Error: ")
	}
	
	username:= os.Getenv("User_name")
	password:= os.Getenv("Db_password")
	// Use the SetServerAPIOptions() method to set the version of the Stable API on the client
	

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)


	opts := options.Client().ApplyURI("mongodb+srv://"+ username + ":" + password + "@codexme.sr0ng.mongodb.net/?retryWrites=true&w=majority&appName=CodexMe").SetServerAPIOptions(serverAPI)
  
	// // Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
	  panic(err)
	}
  
	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
	}()
  
	// // Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
	  panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
	return ""
  }
  