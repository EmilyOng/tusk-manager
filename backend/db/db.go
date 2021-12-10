package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func OpenDB() (err error) {
	DB, err = gorm.Open(sqlite.Open("cvwo.db"), &gorm.Config{})
	return
}
