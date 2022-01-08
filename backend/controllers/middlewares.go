package controllers

import (
	"net/http"

	"github.com/EmilyOng/cvwo/backend/models"
	utils "github.com/EmilyOng/cvwo/backend/utils/auth"

	"github.com/gin-gonic/gin"
)

func SetAuthUser(c *gin.Context) {
	token := GetAuthToken(c)

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
	user := models.AuthUser{
		ID:    claims.UserID,
		Name:  claims.UserName,
		Email: claims.UserEmail,
		Token: token,
	}

	c.Set("user", user)
}

func AuthGuard(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{
			Error: error_UNAUTHORIZED,
		})
	}
}
