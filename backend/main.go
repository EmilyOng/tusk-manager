package main

import (
	"log"

	"github.com/EmilyOng/cvwo/backend/controllers"
	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	err := db.OpenDB()
	if err != nil {
		log.Fatalln("cannot create database", err)
	}
	db.DB.AutoMigrate(
		&models.User{},
		&models.Task{},
		&models.Tag{},
		&models.Board{},
		&models.State{},
		&models.Member{},
	)
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://tusk-manager.vercel.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.Use(controllers.SetAuthUser)

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.Login)
			auth.POST("/signup", controllers.SignUp)
			auth.POST("/logout", controllers.Logout)
			auth.GET("/", controllers.IsAuthenticated)
		}
		guard := api.Group("/", controllers.AuthGuard)
		{
			states := guard.Group("/states")
			{
				states.POST("/", controllers.CreateState)
				states.PUT("/", controllers.UpdateState)
				states.DELETE("/:state_id", controllers.DeleteState)
			}
			boards := guard.Group("/boards")
			{
				boards.GET("/", controllers.GetUserBoards)
				boards.PUT("/", controllers.UpdateBoard)
				boards.DELETE("/:board_id", controllers.DeleteBoard)
				boards.GET("/:board_id", controllers.GetBoard)
				boards.POST("/", controllers.CreateBoard)
				boards.GET("/:board_id/tasks", controllers.GetBoardTasks)
				boards.GET("/:board_id/tags", controllers.GetBoardTags)
				boards.GET("/:board_id/states", controllers.GetBoardStates)
				boards.GET("/:board_id/members", controllers.GetBoardMemberProfiles)
			}
			tasks := guard.Group("/tasks")
			{
				tasks.POST("/", controllers.CreateTask)
				tasks.PUT("/", controllers.UpdateTask)
				tasks.DELETE("/:task_id", controllers.DeleteTask)
			}
			tags := guard.Group(("/tags"))
			{
				tags.POST("/", controllers.CreateTag)
				tags.DELETE("/:tag_id", controllers.DeleteTag)
				tags.PUT("/", controllers.UpdateTag)
			}
		}
	}

	router.Run()
}
