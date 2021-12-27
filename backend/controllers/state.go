package controllers

import (
	"fmt"
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateStatePayload struct {
	Name            string
	BoardID         uint8
	CurrentPosition int
}

type UpdateStatePayload struct {
	ID              uint8
	Name            string
	BoardID         uint8
	CurrentPosition int
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
		Name:            payload.Name,
		BoardID:         payload.BoardID,
		CurrentPosition: payload.CurrentPosition,
	}

	err = state.Create()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, state)
}

func UpdateState(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var payload UpdateStatePayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	state := models.State{
		ID:              payload.ID,
		Name:            payload.Name,
		BoardID:         payload.BoardID,
		CurrentPosition: payload.CurrentPosition,
	}

	err = state.Update()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, state)
}

func DeleteState(c *gin.Context) {
	userInterface, _ := c.Get("user")
	if userInterface == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var stateID uint8
	fmt.Sscan(c.Param("state_id"), &stateID)
	state := models.State{ID: stateID}

	err := state.Delete()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, state)
}
