package models

import (
	"main/db"
)

type Tag struct {
	ID      uint8   `gorm:"primaryKey" json:"id"`
	Name    string  `gorm:"not null" json:"name"`
	Color   Color   `gorm:"not null" json:"color"`
	Tasks   []*Task `gorm:"many2many:task_tags" json:"-"`
	BoardID *uint8  `json:"-"` // Board that the tag belongs to
}

func (tag *Tag) Create() error {
	result := db.DB.Create(tag)
	return result.Error
}
