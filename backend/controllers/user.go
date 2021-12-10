package controllers

import (
	"main/db"
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func FindUser(c *gin.Context) {
	var users []models.User
	db.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}
