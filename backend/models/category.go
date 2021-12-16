package models

import (
	"main/db"
)

type Category struct {
	CommonModel
	Name   string `gorm:"not null" json:"name"`
	Color  string `json:"color"`
	Tasks  []Task `gorm:"not null" json:"tasks"` // Tasks belonging to the category
	UserID uint8  // Refers to the owner of the category
}

func (category *Category) Create() error {
	result := db.DB.Create(category)
	return result.Error
}
