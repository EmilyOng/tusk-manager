package models

import (
	"github.com/jinzhu/gorm"
)

type Category struct {
	gorm.Model
	ID    uint8  `gorm:"primaryKey" json:"id"`
	Name  string `gorm:"not null" json:"name"`
	Color string `gorm:"not null" json:"color"`
	Tasks []Task `gorm:"many2many:task_category"`
}
