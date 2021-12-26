package controllers

import (
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateStatePayload struct {
	Name    string
	BoardID uint8
}

func CreateState(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var payload CreateStatePayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	state := models.State{
		Name:    payload.Name,
		BoardID: payload.BoardID,
	}

	err = state.Create()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, state)
}
