package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {

	// Check if we are in a development environment and if the .env file exists
	if _, err := os.Stat(".env"); err == nil {
		// Load the .env file only in development
		err := godotenv.Load(".env")
		if err != nil {
			log.Printf("Error loading .env file: %v", err)
		}
	} else {
		// If no .env file, assume we're in production where environment variables are set via Docker
		log.Println("No .env file found, skipping loading...")
	}
}
