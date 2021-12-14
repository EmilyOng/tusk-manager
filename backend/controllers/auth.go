package controllers

import (
	"main/models"
	"main/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LoginPayload struct {
	Email    string `binding:"required"`
	Password string `binding:"required"`
}

type SignUpPayload struct {
	Name     string `binding:"required"`
	Email    string `binding:"required"`
	Password string `binding:"required"`
}

type UserResponse struct {
	ID    uint8  `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func IsAuthenticated(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	secretKey, err := utils.GetSecretKey()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	jwtAuth := &utils.JWTAuth{SecretKey: secretKey}
	claims, err := jwtAuth.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, UserResponse{ID: claims.UserID, Name: claims.UserName, Email: claims.UserEmail})
}

func generateJWTToken(c *gin.Context, user models.User) (signedToken string, err error) {
	secretKey, err := utils.GetSecretKey()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	jwtAuth := utils.JWTAuth{
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

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	user := models.User{Email: payload.Email, Password: payload.Password}

	if !user.Exist() {
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
	c.JSON(http.StatusOK, UserResponse{ID: user.ID, Name: user.Name, Email: user.Email})
}

func SignUp(c *gin.Context) {
	var payload SignUpPayload
	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	user := models.User{Name: payload.Name, Email: payload.Email, Password: payload.Password}

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
	c.JSON(http.StatusOK, UserResponse{ID: user.ID, Name: user.Name, Email: user.Email})
}
