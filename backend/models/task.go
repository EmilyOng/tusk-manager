package models

import (
	"main/db"
	"time"
)

type State int

const (
	Unstarted State = iota
	InProgress
	Completed
	Unknown
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
	CommonModel
	Name        string    `gorm:"not null" json:"name"`
	Description string    `json:"description"`
	DueAt       time.Time `json:"dueAt"`
	State       State     `gorm:"not null" json:"state"`
	Owner       User      `gorm:"not null; foreignKey:ID"`
	Tags        []Tag     `gorm:"many2many:task_tag"`
	Category    Category  `gorm:"not null; foreignKey:ID"`
}

func (task *Task) Create() error {
	result := db.DB.Create(task)
	return result.Error
}
