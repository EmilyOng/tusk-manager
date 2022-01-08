package controllers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	userService "github.com/EmilyOng/cvwo/backend/services/user"
	authUtils "github.com/EmilyOng/cvwo/backend/utils/auth"
	seedUtils "github.com/EmilyOng/cvwo/backend/utils/seed"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAuthToken(c *gin.Context) (token string) {
	token_ := strings.Split(c.Request.Header.Get("Authorization"), "Bearer ")
	if len(token_) < 2 {
		c.Set("user", nil)
		return
	}
	token = strings.Trim(token_[1], " ")
	return
}

func GenerateJWTToken(c *gin.Context, user models.UserPrimitive) (signedToken string, err error) {
	secretKey, err := authUtils.GetSecretKey()
	if err != nil {
		return
	}

	jwtAuth := authUtils.JWTAuth{
		SecretKey: secretKey,
	}

	signedToken, err = jwtAuth.GenerateToken(user)
	if err != nil {
		return
	}

	return
}

func IsAuthenticated(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{Error: error_UNAUTHORIZED})
		return
	}
	user := userInterface.(models.AuthUser)
	token := GetAuthToken(c)
	c.JSON(http.StatusOK, models.AuthUserResponse{
		User: models.AuthUser{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Token: token,
		},
	})
}

func Login(c *gin.Context) {
	var payload models.LoginPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	var user models.UserPrimitive
	err = db.DB.Model(&models.User{}).Where("Email = ?", payload.Email).Find(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// User record does not exist
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{Error: error_INVALID_EMAIL})
		return
	}

	err = authUtils.ComparePassword(user.Password, payload.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{Error: error_INVALID_PASSWORD})
		return
	}

	signedToken, err := GenerateJWTToken(c, user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.Response{Error: error_UNEXPECTED})
		return
	}
	c.JSON(http.StatusOK, models.LoginResponse{
		User: models.AuthUser{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Token: signedToken,
		},
	})
}

func SignUp(c *gin.Context) {
	var payload models.SignUpPayload
	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	var user models.UserPrimitive
	err = db.DB.Model(&models.User{}).Where("Email = ?", payload.Email).First(&user).Error

	if err != nil {
		// User record already exists
		c.AbortWithStatusJSON(http.StatusOK, models.Response{Error: error_USER_EXISTS})
		return
	}

	hashedPassword, err := authUtils.HashPassword(payload.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.Response{Error: error_UNEXPECTED})
		return
	}

	user.Password = hashedPassword
	user, err = userService.CreateUser(user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.Response{Error: error_UNEXPECTED})
		return
	}

	signedToken, err := GenerateJWTToken(c, user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.Response{Error: error_UNEXPECTED})
		return
	}

	// Generate seed data
	err = seedUtils.SeedData(&user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.Response{Error: error_UNEXPECTED})
		return
	}
	c.JSON(http.StatusOK, models.SignUpResponse{
		User: models.AuthUser{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Token: signedToken,
		},
	})
}

func Logout(c *gin.Context) {
	c.Set("user", nil)
	c.JSON(http.StatusOK, gin.H{})
}
