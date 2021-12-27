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

func SetAuthUser(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.Set("user", nil)
		return
	}

	secretKey, err := utils.GetSecretKey()
	if err != nil {
		c.Set("user", nil)
		return
	}

	jwtAuth := &utils.JWTAuth{SecretKey: secretKey}
	claims, err := jwtAuth.ValidateToken(token)
	if err != nil {
		c.Set("user", nil)
		return
	}
	user := models.User{ID: claims.UserID, Name: claims.UserName, Email: claims.UserEmail}

	c.Set("user", user)
}

func IsAuthenticated(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)
	c.JSON(http.StatusOK, UserResponse{ID: user.ID, Name: user.Name, Email: user.Email})
}

func generateJWTToken(c *gin.Context, user models.User) (signedToken string, err error) {
	secretKey, err := utils.GetSecretKey()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	jwtAuth := utils.JWTAuth{
		SecretKey: secretKey,
	}

	signedToken, err = jwtAuth.GenerateToken(user)
	if err != nil {
		return
	}

	c.SetCookie("token", signedToken, int(time.Now().Add(24*time.Hour).Unix()), "", "", true, false)
	return
}

func Login(c *gin.Context) {
	var payload LoginPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{Email: payload.Email, Password: payload.Password}
	if !user.Exist() {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid email/password"})
		return
	}

	err = user.CheckPassword(payload.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	_, err = generateJWTToken(c, user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, UserResponse{ID: user.ID, Name: user.Name, Email: user.Email})
}

func SignUp(c *gin.Context) {
	var payload SignUpPayload
	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{Name: payload.Name, Email: payload.Email, Password: payload.Password}

	if user.Exist() {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"error": "User already exists"})
		return
	}

	err = user.HashPassword(user.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = user.Create()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = generateJWTToken(c, user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Generate seed data
	err = models.SeedData(&user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, UserResponse{ID: user.ID, Name: user.Name, Email: user.Email})
}

func Logout(c *gin.Context) {
	// Delete the cookie
	c.SetCookie("token", "", int(time.Now().Add(-24*time.Hour).Unix()), "", "", true, false)
	c.Set("user", nil)
	c.JSON(http.StatusOK, gin.H{})
}
