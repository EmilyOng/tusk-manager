package models

import (
	"main/db"
)

type Category struct {
	CommonModel
	Name  string `gorm:"not null" json:"name"`
	Color string `gorm:"not null" json:"color"`
	Tasks []Task `gorm:"not null; foreignKey:ID"`
}

func (category *Category) Create() error {
	result := db.DB.Create(category)
	return result.Error
}
