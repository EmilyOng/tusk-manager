package models

import (
	"github.com/jinzhu/gorm"
)

type Category struct {
	gorm.Model
	Name  string `gorm:"not null"`
	Color string `gorm:"not null"`
	Tasks []Task `gorm:"many2many:task_category"`
}
