package models

import (
	"main/db"
)

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

func (state *State) Update() error {
	result := db.DB.Model(state).Save(state)
	return result.Error
}

func (state *State) GetTasks() (tasks []Task, err error) {
	err = db.DB.Model(state).Association("Tasks").Find(&tasks)
	return
}

func (state *State) Delete() error {
	tasks, err := state.GetTasks()
	if err != nil {
		return err
	}
	for _, task := range tasks {
		err = task.Delete()
		if err != nil {
			return err
		}
	}

	result := db.DB.Delete(state)
	return result.Error
}
