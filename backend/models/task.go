package models

import (
	"main/db"
	"time"
)

type State string

const (
	Unstarted  State = "Unstarted"
	InProgress State = "InProgress"
	Completed  State = "Completed"
)

type Task struct {
	CommonModel
	Name        string    `gorm:"not null" json:"name"`
	Description string    `json:"description"`
	DueAt       time.Time `json:"dueAt"`
	State       State     `gorm:"default:'Unstarted'" json:"state"`
	Tags        []Tag     `gorm:"many2many:task_tags" json:"tags"`
	UserID      uint8     // Owner of the task
	BoardID     uint8     // Board that the task belongs to
}

func (task *Task) Create() error {
	result := db.DB.Create(task)
	return result.Error
}
