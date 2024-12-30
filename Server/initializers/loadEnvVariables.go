package initializers

import (
	"fmt"
	"github.com/joho/godotenv"
)

func LoadEnvVariables() {

	// Load the envitomental variables
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
		panic(err)
	}
}
