package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func OpenDB() (err error) {
	// DB_URL := os.Getenv("DATABASE_URL")
	// DB, err = gorm.Open(postgres.Open(DB_URL), &gorm.Config{})
	DB, err = gorm.Open(sqlite.Open("cvwo.db"), &gorm.Config{})
	return
}
