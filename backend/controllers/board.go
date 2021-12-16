package controllers

import (
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBoards(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)

	boards, err := user.GetBoards()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, boards)
}
