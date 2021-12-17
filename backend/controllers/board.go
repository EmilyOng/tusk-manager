package controllers

import (
	"fmt"
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BoardsResponse struct {
}

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

func GetTasks(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var boardID uint8
	fmt.Sscan(c.Param("board-id"), &boardID)
	board := models.Board{CommonModel: models.CommonModel{ID: boardID}}
	tasks, err := board.GetTasks()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}
