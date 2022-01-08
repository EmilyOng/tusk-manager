package controllers

import (
	"fmt"
	"net/http"

	"github.com/EmilyOng/cvwo/backend/models"
	tagService "github.com/EmilyOng/cvwo/backend/services/tag"

	"github.com/gin-gonic/gin"
)

func CreateTag(c *gin.Context) {
	var payload models.CreateTagPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	createTagResponse := tagService.CreateTag(payload)
	c.JSON(http.StatusOK, createTagResponse)
}

func DeleteTag(c *gin.Context) {
	var tagId uint8
	fmt.Sscan(c.Param("tag_id"), &tagId)

	deleteTagResponse := tagService.DeleteTag(models.DeleteTagPayload{ID: tagId})
	c.JSON(http.StatusOK, deleteTagResponse)
}

func UpdateTag(c *gin.Context) {
	var payload models.UpdateTagPayload

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.Response{Error: error_UNEXPECTED})
		return
	}

	updateTagResponse := tagService.UpdateTag(payload)
	c.JSON(http.StatusOK, updateTagResponse)
}
