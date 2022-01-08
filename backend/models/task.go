package models

import (
	"time"
)

type Task struct {
	ID          uint8      `gorm:"primary_key" json:"id"`
	Name        string     `gorm:"not null" json:"name"`
	Description string     `gorm:"default:''" json:"description"`
	DueAt       *time.Time `json:"dueAt" ts_type:"Date" ts_transform:"new Date(__VALUE__)"`
	Tags        []*Tag     `gorm:"many2many:task_tags" json:"tags"`
	UserID      *uint8     `json:"userId"`                  // Owner of the task
	BoardID     *uint8     `json:"boardId"`                 // Board that the task belongs to
	StateID     *uint8     `gorm:"not null" json:"stateId"` // State that the task is at
}

type TaskPrimitive struct {
	ID          uint8      `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	DueAt       *time.Time `json:"dueAt" ts_type:"Date" ts_transform:"new Date(__VALUE__)"`
	UserID      *uint8     `json:"userId"`
	BoardID     *uint8     `json:"boardId"`
	StateID     *uint8     `gorm:"not null" json:"stateId"`
}

// Create Task
type CreateTaskPayload struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	DueAt       string          `json:"dueAt,omitempty" ts_type:"Date" ts_transform:"new Date(__VALUE__)"`
	StateID     uint8           `json:"stateId"`
	Tags        []*TagPrimitive `json:"tags"`
	BoardID     uint8           `json:"boardId"`
	UserID      uint8           `json:"userId"`
}

type CreateTaskResponse struct {
	Response
	Task Task `json:"data"`
}

// Update Task
type UpdateTaskPayload struct {
	ID          uint8           `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	DueAt       string          `json:"dueAt,omitempty" ts_type:"Date" ts_transform:"new Date(__VALUE__)"`
	StateID     uint8           `json:"stateId"`
	Tags        []*TagPrimitive `json:"tags"`
	BoardID     uint8           `json:"boardId"`
	UserID      uint8           `json:"userId"`
}

type UpdateTaskResponse struct {
	Response
	Task Task `json:"data"`
}

// Delete Task
type DeleteTaskPayload struct {
	ID uint8 `json:"id"`
}

type DeleteTaskResponse struct {
	Response
}
