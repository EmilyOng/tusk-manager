package controllers

import (
	"fmt"
	"net/http"

	"github.com/EmilyOng/cvwo/backend/models"
	taskService "github.com/EmilyOng/cvwo/backend/services/task"

	"github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context) {
	var payload models.CreateTaskPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	createTaskResponse := taskService.CreateTask(payload)
	c.JSON(http.StatusOK, createTaskResponse)
}

func UpdateTask(c *gin.Context) {
	var payload models.UpdateTaskPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	updateTaskResponse := taskService.UpdateTask(payload)
	c.JSON(http.StatusOK, updateTaskResponse)
}

func DeleteTask(c *gin.Context) {
	var taskId uint8
	fmt.Sscan(c.Param("task_id"), &taskId)

	deleteTaskResponse := taskService.DeleteTask(models.DeleteTaskPayload{ID: taskId})
	c.JSON(http.StatusOK, deleteTaskResponse)
}
