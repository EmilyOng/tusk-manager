package main

import (
	"log"
	"main/controllers"
	"main/db"
	"main/models"

	"github.com/gin-gonic/gin"
)

func main() {
	err := db.OpenDB()
	if err != nil {
		log.Fatalln("cannot create database", err)
	}
	db.DB.AutoMigrate(&models.User{}, &models.Task{}, &models.Tag{}, &models.Category{})
	router := gin.Default()

	api := router.Group("/api")
	{
		api.GET("/", controllers.FindUser)
	}

	router.Run(":5000")
}
