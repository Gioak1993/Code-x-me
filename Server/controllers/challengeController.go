package controllers

import (
	"code-x-me/server/api"
	"code-x-me/server/initializers"
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TestCase struct {
	Input          []interface{} `bson:"input" json:"input"` // Generic array for multiple input types
	ExpectedOutput interface{}   `bson:"expected_output" json:"expected_output"`
}

type CodeChallenge struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProblemName        string             `bson:"problem_name" json:"problem_name"`
	ProblemExplanation string             `bson:"problem_explanation" json:"problem_explanation"`
	InputsOutputs      []TestCase         `bson:"inputs_outputs" json:"inputs_outputs"` // JSON string
	Constraints        string             `bson:"constraints" json:"constraints"`
	Difficulty         string             `bson:"difficulty" json:"difficulty"`
}

type UserSubmission struct {
	ChallengeID string `json:"challenge_id"`
	LanguageId  int    `json:"language_id"`
	SourceCode  string `json:"source_code"`
}


func CreateChallenge(c *gin.Context) {

	var challenge CodeChallenge

	if err := c.BindJSON(&challenge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ivalid JSON payload",
		})
		return
	}

	coll := initializers.DBClient.Database("codexme").Collection("challenges")
	doc := CodeChallenge{ProblemName: challenge.ProblemName,
		ProblemExplanation: challenge.ProblemExplanation,
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
	}

	var challenges []CodeChallenge
	if err = cursor.All(context.Background(), &challenges); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error when decoding challenges",
		})
	}

	c.JSON(http.StatusOK, challenges)
}

func GetChallenge(c *gin.Context) {

	coll := initializers.DBClient.Database("codexme").Collection("challenges")

	challengeID := c.Param("id")

	hexID, err := primitive.ObjectIDFromHex(challengeID) // Convert the string ID to an ObjectID
	if err != nil {
		panic(err)
	}

	filter := bson.D{{Key: "_id", Value: hexID}}

	var result CodeChallenge
	err = coll.FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"error": "the Challenge was not found"})
			return
		}
		panic(err)
	}

	c.JSON(http.StatusOK, result)
}

var languageTemplates = map[int]string{
	92: `print(solution(%s))`,                            // Python
	93: `console.log(solution(%s));`,            // JavaScript
	94: `console.log(solution(%s));`,      // TypeScript
	83: `print(solution(%s))`,                       // Swift
	45: `; Assembly solution\nsolution:\n    call solution with parameters: %s`, // Assembly
	46: `function main() {\n    solution(%s)\n}`,                          // Bash
	75: `int main() {\n    printf("%d", solution(%s));\n    return 0;\n}`, // C
	76: `int main() {\n    std::cout << solution(%s);\n    return 0;\n}`,  // C++
	51: `class Program {\n    static void Main() {\n        Console.WriteLine(Solution(%s));\n    }\n}`, // C#
	77: `IDENTIFICATION DIVISION.\nPROGRAM-ID. MAIN.\nPROCEDURE DIVISION.\n    DISPLAY "Solution result: %s"\n    STOP RUN.`, // COBOL
	56: `void main() {\n    writeln(solution(%s));\n}`,                    // D
	90: `void main() {\n    print(solution(%s));\n}`,                      // Dart
	57: `def main():\n    IO.puts Solution.solution(%s)`,                 // Elixir
	58: `int main() {\n    io:format("~p", [solution(%s)]).}\n`,            // Erlang
	87: `let main() =\n    printfn "%A" (solution %s)`,                    // F#
	59: `PROGRAM main\n    WRITE(solution(%s));\nEND PROGRAM main`,        // Fortran
	95: `func main() {\n    fmt.Println(solution(%s))\n}`,                 // Go
	88: `def main():\n    println(solution(%s))`,                         // Groovy
	61: `main :: IO ()\nmain = putStrLn $ show $ solution %s`,            // Haskell
	78: `fun main() {\n    println(solution(%s))\n}`,                     // Kotlin
	64: `function main()\n    print(solution(%s))\nend`,                  // Lua
	79: `int main() {\n    printf("%d", solution(%s));\n    return 0;\n}`, // Objective-C
	66: `function main()\n    printf("Solution: %s", solution(%s));\nend`, // Octave
	85: `sub main {\n    print solution(%s);\n}`,                           // Perl
	80: `main <- function() {\n    cat(solution(%s))\n}`,                  // R
	72: `def main():\n    puts solution(%s)`,                             // Ruby
	81: `object Main {\n    def main() {\n        println(solution(%s))\n    }\n}`, // Scala
}

// Function to dynamically construct the execution logic
func buildExecutionCode(languageID int, sourceCode string, inputs []interface{}) string {
	inputStr := ""
	for _, input := range inputs {
		inputStr += fmt.Sprintf("%v,", input)
	}
	inputStr = strings.TrimRight(inputStr, ",") // Remove trailing comma

	// Check if the language has a specific template
	template, found := languageTemplates[languageID]
	if found {
		return fmt.Sprintf("%s\n%s", sourceCode, fmt.Sprintf(template, inputStr))
	}

	// Default fallback if no template is found
	return fmt.Sprintf("%s\n// Execute solution with inputs: %s", sourceCode, inputStr)
}


// SubmitChallenge logic with dynamic language support
func SubmitChallenge(c *gin.Context) {
	var submission UserSubmission

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
	var challenge CodeChallenge

	err = coll.FindOne(context.TODO(), filter).Decode(&challenge)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"error": "The Challenge was not found"})
			return
		}
		panic(err)
	}

	var testingsSubmission []api.RequestsJudgeZeroApi

	for _, testCase := range challenge.InputsOutputs {
		sourceCode := buildExecutionCode(submission.LanguageId, submission.SourceCode, testCase.Input)

		expectedOutputStr := fmt.Sprintf("%v", testCase.ExpectedOutput)

		testingsSubmission = append(testingsSubmission, api.RequestsJudgeZeroApi{
			SourceCode:     sourceCode,
			LanguageID:     submission.LanguageId,
			ExpectedOutput: expectedOutputStr,
		})
	}

	result := api.BatchJudgeZero(testingsSubmission)

	c.JSON(http.StatusOK, result)
}