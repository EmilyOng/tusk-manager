package main

import (
	"log"
	"main/controllers"
	"main/db"
	"main/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	err := db.OpenDB()
	if err != nil {
		log.Fatalln("cannot create database", err)
	}
	db.DB.AutoMigrate(&models.User{}, &models.Task{}, &models.Tag{}, &models.Board{})
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "accept", "credentials", "origin", "Cache-Control"},
		AllowCredentials: true,
	}))

	router.Use(controllers.SetAuthUser)

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.Login)
			auth.POST("/signup", controllers.SignUp)
			auth.GET("/", controllers.IsAuthenticated)
		}
		guard := api.Group("/")
		{
			boards := guard.Group("/boards")
			{
				boards.GET("/", controllers.GetBoards)
				boards.POST("/", controllers.CreateBoard)
				boards.GET("/:board_id/tasks", controllers.GetTasksWithTags)
			}
		}
	}

	router.Run(":5000")
}
