package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type State int

const (
	Unstarted State = iota
	InProgress
	Completed
)

func (s State) String() string {
	switch s {
	case Unstarted:
		return "Unstarted"
	case InProgress:
		return "InProgress"
	case Completed:
		return "Completed"
	}
	return "Unknown"
}

type Task struct {
	gorm.Model
	Name     string `gorm:"not null"`
	DueAt    time.Time
	State    State    `gorm:"not null"`
	Owner    User     `gorm:"not null; foreignKey:ID"`
	Tags     []Tag    `gorm:"many2many:task_tag"`
	Category Category `gorm:"many2many:task_category"`
}
