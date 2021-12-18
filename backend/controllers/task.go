package controllers

import (
	"main/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateTaskPayload struct {
	Name        string
	Description string
	DueAt       time.Time
	State       models.State
	BoardID     uint8
}

func CreateTask(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)

	var payload CreateTaskPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task := models.Task{
		Name:        payload.Name,
		Description: payload.Description,
		DueAt:       payload.DueAt,
		State:       payload.State,
		BoardID:     payload.BoardID,
		UserID:      user.ID,
	}
	err = task.Create()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}
