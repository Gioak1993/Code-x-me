package initializers

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DBClient *mongo.Client

func DbConnect() (*mongo.Client, error) {

	var err error
	username := os.Getenv("User_name")
	password := os.Getenv("Db_password")
	// Use the SetServerAPIOptions() method to set the version of the Stable API on the client

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	opts := options.Client().ApplyURI("mongodb+srv://" + username + ":" + password + "@codexme.sr0ng.mongodb.net/?retryWrites=true&w=majority&appName=CodexMe").SetServerAPIOptions(serverAPI)

	// // Create a new client and connect to the server
	DBClient, err = mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}
	// // // // Send a ping to confirm a successful connection
	if err := DBClient.Ping(context.TODO(), nil); err != nil {
		panic(err)
	}
	// fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
	return DBClient, err //dont forget to defer your connection when you use it outside this function
}
