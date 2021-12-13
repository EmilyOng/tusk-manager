package controllers

import (
	"log"
	"main/auth"
	"main/db"
	"main/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type LoginPayload struct {
	Email    string
	Password string
}

func getSecretKey() (secretKey string, err error) {
	err = godotenv.Load()

	if err != nil {
		log.Fatalln("Error loading .env file")
		return
	}

	secretKey = os.Getenv("AUTH_SECRET_KEY")
	return
}

func Token(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	secretKey, err := getSecretKey()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	jwtAuth := &auth.JWTAuth{SecretKey: secretKey}
	claims, err := jwtAuth.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, models.User{ID: claims.UserID, Name: claims.UserName, Email: claims.UserEmail})
}

func generateJWTToken(c *gin.Context, user models.User) (signedToken string, err error) {
	secretKey, err := getSecretKey()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	jwtAuth := auth.JWTAuth{
		SecretKey: secretKey,
	}

	signedToken, err = jwtAuth.GenerateToken(user)
	if err != nil {
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    signedToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: false,
		SameSite: 2,
		Secure:   true,
	})
	return
}

func Login(c *gin.Context) {
	var payload LoginPayload
	var user models.User

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	res := db.DB.Where(&models.User{Email: payload.Email}).First(&user)
	if res.Error != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	err = user.CheckPassword(payload.Password)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	_, err = generateJWTToken(c, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
	}
	c.JSON(http.StatusOK, models.User{ID: user.ID, Name: user.Name, Email: user.Email})
}

func SignUp(c *gin.Context) {
	var user models.User
	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	if user.Exist() {
		c.JSON(http.StatusOK, gin.H{"error": "A user with the email already exists"})
		c.Abort()
		return
	}

	err = user.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	err = user.Create()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	_, err = generateJWTToken(c, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
	}

	// Generate seed data
	err = models.SeedData(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
	}
	c.JSON(http.StatusOK, models.User{ID: user.ID, Name: user.Name, Email: user.Email})
}
