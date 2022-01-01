package db

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func OpenDB() (err error) {
	DB_URL := os.Getenv("DATABASE_URL")
	DB, err = gorm.Open(postgres.Open(DB_URL), &gorm.Config{})
	return
}
