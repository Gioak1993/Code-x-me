package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"code-x-me/server/initializers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RequireAuth(c *gin.Context) {

	type User struct {
		ID        primitive.ObjectID `bson:"_id,omitempty"`
		UserName  string             `bson:"username"`
		Email     string             `bson:"email"`
		Password  string             `bson:"password"`
		CreatedAt time.Time          `bson:"createdAt"`
	}

	// get the cookie of req

	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		fmt.Println("no cookie found")
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Decode/validate it

	// Parse takes the token string and a function for looking up the key. The latter is especially
	// useful if you use multiple keys for your application.  The standard is to use 'kid' in the
	// head of the token to identify which key to use, but the parsed token (head and claims) is provided
	// to the callback, providing flexibility.
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		log.Fatal(err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["sub"], claims["exp"])

		//check the exp

		if float64(time.Now().Unix()) < claims["exp"].(float64) {

			// find the user with the token

			var user User

			sub, ok := claims["sub"].(string)
			if !ok {
				log.Fatal("sub claim is not a string")
			}

			id, err := primitive.ObjectIDFromHex(sub)
			if err != nil {
				log.Fatal("Invalid ObjectID:", err)
			}

			coll := initializers.DBClient.Database("codexme").Collection("users")

			// Creates a query filter to match documents with the email

			filter := bson.D{{Key: "_id", Value: id}}

			err = coll.FindOne(context.TODO(), filter).Decode(&user)

			// Prints a message if no documents are matched or if any
			// other errors occur during the operation
			if err != nil {
				if err == mongo.ErrNoDocuments {
					c.AbortWithStatus(http.StatusUnauthorized)
					return
				}
				panic(err)
			}

			//attacht to req

			c.Set("user", user)

			//continue

			c.Next()

		}

	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

}
