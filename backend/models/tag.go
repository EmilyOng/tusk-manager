package models

import "main/db"

type Tag struct {
	ID    uint8  `gorm:"primaryKey" json:"id"`
	Name  string `gorm:"not null" json:"name"`
	Tasks []Task `gorm:"many2many:task_tags" json:"-"`
}

func (tag *Tag) Create() error {
	result := db.DB.Create(tag)
	return result.Error
}
