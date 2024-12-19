package controllers

import (
	"code-x-me/server/initializers"
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UserName  string             `bson:"username"`
	Email     string             `bson:"email"`
	Password  string             `bson:"password"`
	CreatedAt time.Time          `bson:"createdAt"`
}

func SignUp(c *gin.Context) {

	var user User

	// Bind JSON payload to the struct

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	hashedPaswword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error when hashing password",
		})
	}

	coll := initializers.DBClient.Database("codexme").Collection("users")
	doc := User{UserName: user.UserName, Email: user.Email, Password: hashedPaswword, CreatedAt: time.Now()}

	result, err := coll.InsertOne(context.TODO(), doc)
	if err != nil {
		fmt.Println("error when inserting user", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error when inserting user",
		})
	}

	fmt.Printf("Inserted user with _id: %v\n", result.InsertedID)
	c.JSON(http.StatusOK, result)

}

func Login(c *gin.Context) {

	var user User

	// Bind JSON payload to the struct

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	coll := initializers.DBClient.Database("codexme").Collection("users")

	// Creates a query filter to match documents with the email

	filter := bson.D{{Key: "email", Value: user.Email}}

	// Retrieves the first matching document
	var result User
	err := coll.FindOne(context.TODO(), filter).Decode(&result)

	// Prints a message if no documents are matched or if any
	// other errors occur during the operation
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User or Password"})
			return
		}
		panic(err)
	}

	// Compare the provided password with the stored hash

	if err := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User or Password"})
		return

	}

	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": result.ID,
		"exp": time.Now().Add(time.Hour).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Fail to create token"})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{})

}

func Validate(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"message": "Im logged in",
	})

}

func LogOut(c *gin.Context) {

	if _, err := c.Cookie("Authorization"); err == nil {
		c.SetCookie("Authorization", "", -1, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{
			"message": "You Logout",
		})

	}
}

func hashPassword(password string) (string, error) {

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error")
	}

	return string(hash), err

}
