package controllers

import (
	"fmt"
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateBoardPayload struct {
	Name  string
	Color models.Color
}

type UpdateBoardPayload struct {
	ID    uint8
	Name  string
	Color models.Color
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

func GetBoardTasksWithTags(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	board := models.Board{CommonModel: models.CommonModel{ID: boardID}}
	tasks, err := board.GetTasksWithTags()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func CreateBoard(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)

	var payload CreateBoardPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	board := models.Board{Name: payload.Name, Color: payload.Color, UserID: user.ID}
	err = board.Create()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, board)
}

func GetBoardTags(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	board := models.Board{CommonModel: models.CommonModel{ID: boardID}}
	tags, err := board.GetTags()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tags)
}

func GetBoard(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	board := models.Board{CommonModel: models.CommonModel{ID: boardID}}
	err := board.Get()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, board)
}

func UpdateBoard(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user := userInterface.(models.User)

	var payload UpdateBoardPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	board := models.Board{
		CommonModel: models.CommonModel{ID: payload.ID},
		Name:        payload.Name,
		Color:       payload.Color,
		UserID:      user.ID,
	}

	err = board.Update()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, board)
}

func DeleteBoard(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	board := models.Board{CommonModel: models.CommonModel{ID: boardID}}

	err := board.Delete()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, board)
}
