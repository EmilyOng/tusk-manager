package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func OpenDB() (err error) {
	err = godotenv.Load()

	if err != nil {
		// It is only loaded in development environment
		log.Println("Error loading .env file")
	}

	DB_URL := os.Getenv("DATABASE_URL")
	DB, err = gorm.Open(postgres.Open(DB_URL), &gorm.Config{})
	// DB, err = gorm.Open(sqlite.Open("cvwo.db"), &gorm.Config{})
	return
}
