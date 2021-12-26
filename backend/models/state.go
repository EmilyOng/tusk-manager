package models

import "main/db"

type State struct {
	ID      uint8   `gorm:"primaryKey" json:"id"`
	Name    string  `gorm:"not null" json:"name"`
	Tasks   *[]Task `gorm:"not null" json:"-"` // Tasks belonging to the state
	BoardID uint8   `json:"-"`                 // Board that the state belongs to
}

func GetDefaultStates() []string {
	return []string{"To Do", "In Progress", "Completed"}
}

func (state *State) Create() error {
	result := db.DB.Create(state)
	return result.Error
}
