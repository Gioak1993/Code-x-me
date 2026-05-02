package initializers

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DBClient *mongo.Client

func DbConnect() (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(mongoURI()).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(ctx, opts)
	if err != nil {
		return nil, fmt.Errorf("connect to mongodb: %w", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("ping mongodb: %w", err)
	}

	DBClient = client
	return DBClient, nil
}

func mongoURI() string {
	if uri := os.Getenv("MONGODB_URI"); uri != "" {
		return uri
	}

	username := os.Getenv("DB_USERNAME")
	if username == "" {
		username = os.Getenv("USERNAME")
	}
	password := os.Getenv("DB_PASSWORD")

	return fmt.Sprintf(
		"mongodb+srv://%s:%s@codexme.sr0ng.mongodb.net/?retryWrites=true&w=majority&appName=CodexMe",
		url.QueryEscape(username),
		url.QueryEscape(password),
	)
}
