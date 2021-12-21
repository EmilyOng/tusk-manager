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
	DueAt       string
	State       models.State
	Tags        []models.Tag
	BoardID     uint8
}

type UpdateTaskPayload struct {
	ID          uint8
	Name        string
	Description string
	DueAt       string
	State       models.State
	Tags        []models.Tag
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
		State:       payload.State,
		Tags:        &payload.Tags,
		BoardID:     payload.BoardID,
		UserID:      user.ID,
	}
	if len(payload.DueAt) > 0 {
		t, _ := time.Parse(time.RFC3339, payload.DueAt)
		task.DueAt = &t
	}
	err = task.Create()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

func UpdateTask(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)

	var payload UpdateTaskPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task := models.Task{
		CommonModel: models.CommonModel{ID: payload.ID},
		Name:        payload.Name,
		Description: payload.Description,
		State:       payload.State,
		Tags:        &payload.Tags,
		BoardID:     payload.BoardID,
		UserID:      user.ID,
	}
	if len(payload.DueAt) > 0 {
		t, _ := time.Parse(time.RFC3339, payload.DueAt)
		task.DueAt = &t
	}

	err = task.Update()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}
