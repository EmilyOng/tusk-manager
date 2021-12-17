package models

import (
	"main/db"
)

type Board struct {
	CommonModel
	Name   string `gorm:"not null" json:"name"`
	Color  Color  `gorm:"not null" json:"color"`
	Tasks  []Task `gorm:"not null" json:"-"` // Tasks belonging to the board
	UserID uint8  // Refers to the owner of the board
}

func (board *Board) Create() error {
	result := db.DB.Create(board)
	return result.Error
}
