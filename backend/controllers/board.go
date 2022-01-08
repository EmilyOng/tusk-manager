package controllers

import (
	"fmt"
	"net/http"

	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	boardService "github.com/EmilyOng/cvwo/backend/services/board"
	userService "github.com/EmilyOng/cvwo/backend/services/user"
	commonUtils "github.com/EmilyOng/cvwo/backend/utils/common"

	"github.com/gin-gonic/gin"
)

func GetUserBoards(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{Error: error_UNAUTHORIZED})
		return
	}
	user := userInterface.(models.AuthUser)

	boards, err := userService.GetUserBoards(user.ID)
	c.JSON(http.StatusOK, models.GetUserBoardsResponse{
		Response: models.Response{Error: err},
		Boards:   boards,
	})
}

func GetBoardTasks(c *gin.Context) {
	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	getBoardTasksResponse := boardService.GetBoardTasks(models.GetBoardTasksPayload{BoardID: boardID})
	c.JSON(http.StatusOK, getBoardTasksResponse)
}

func CreateBoard(c *gin.Context) {
	var payload models.CreateBoardPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	var states []*models.State
	for i, state := range commonUtils.GetDefaultStates() {
		states = append(states, &models.State{
			Name:            state,
			CurrentPosition: i,
		})
	}

	res := db.DB.Create(&states)
	if err = res.Error; err != nil {
		return
	}

	createBoardResponse := boardService.CreateBoard(payload)
	c.JSON(http.StatusOK, createBoardResponse)
}

func GetBoardTags(c *gin.Context) {
	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	getBoardTagsResponse := boardService.GetBoardTags(models.GetBoardTagsPayload{BoardID: boardID})
	c.JSON(http.StatusOK, getBoardTagsResponse)
}

func GetBoard(c *gin.Context) {
	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	getBoardResponse := boardService.GetBoard(models.GetBoardPayload{ID: boardID})
	c.JSON(http.StatusOK, getBoardResponse)
}

func UpdateBoard(c *gin.Context) {
	var payload models.UpdateBoardPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	updateBoardResponse := boardService.UpdateBoard(payload)
	c.JSON(http.StatusOK, updateBoardResponse)
}

func DeleteBoard(c *gin.Context) {
	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	deleteBoardResponse := boardService.DeleteBoard(models.DeleteBoardPayload{ID: boardID})
	c.JSON(http.StatusOK, deleteBoardResponse)
}

func GetBoardStates(c *gin.Context) {
	var boardID uint8
	fmt.Sscan(c.Param("board_id"), &boardID)
	getBoardStatesResponse := boardService.GetBoardStates(models.GetBoardStatesPayload{BoardID: boardID})
	c.JSON(http.StatusOK, getBoardStatesResponse)
}
