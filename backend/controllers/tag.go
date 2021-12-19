package controllers

import (
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateTagPayload struct {
	Name    string
	Color   models.Color
	BoardID uint8
}

func CreateTag(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var payload CreateTagPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tag := models.Tag{
		Name:    payload.Name,
		Color:   payload.Color,
		BoardID: payload.BoardID,
	}
	err = tag.Create()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tag)
}
