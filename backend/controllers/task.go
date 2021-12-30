package controllers

import (
	"fmt"
	"main/models"
	"main/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateTaskPayload struct {
	Name        string
	Description string
	DueAt       string
	StateID     uint8
	Tags        []models.Tag
	BoardID     uint8
}

type UpdateTaskPayload struct {
	ID          uint8
	Name        string
	Description string
	DueAt       string
	StateID     uint8
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
		Tags:        &payload.Tags,
		StateID:     payload.StateID,
		BoardID:     payload.BoardID,
		UserID:      user.ID,
	}
	if len(payload.DueAt) > 0 {
		t, _ := time.Parse(utils.DatetimeLayout, payload.DueAt)
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
		Tags:        &payload.Tags,
		StateID:     payload.StateID,
		BoardID:     payload.BoardID,
		UserID:      user.ID,
	}
	if len(payload.DueAt) > 0 {
		t, _ := time.Parse(utils.DatetimeLayout, payload.DueAt)
		task.DueAt = &t
	}

	err = task.Update()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)

	var taskId uint8
	fmt.Sscan(c.Param("task_id"), &taskId)

	task := models.Task{
		CommonModel: models.CommonModel{ID: taskId},
		UserID:      user.ID,
	}

	err := task.Delete()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}
