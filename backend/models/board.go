package models

import (
	"main/db"
)

type Board struct {
	CommonModel
	Name   string   `gorm:"not null" json:"name"`
	Color  Color    `gorm:"not null" json:"color"`
	Tasks  *[]Task  `gorm:"not null" json:"-"` // Tasks belonging to the board
	Tags   *[]Tag   `gorm:"not null" json:"-"` // Tags belonging to the board
	States *[]State `gorm:"not null" json:"-"` // States belonging to the board
	UserID uint8    `json:"-"`                 // Refers to the owner of the board
}

func (board *Board) Create() error {
	result := db.DB.Create(board)
	return result.Error
}

func (board *Board) Get() error {
	result := db.DB.Where(&Board{CommonModel: CommonModel{ID: board.ID}}).First(&board)
	return result.Error
}

func (board *Board) GetTasksWithTags() (tasks []Task, err error) {
	err = db.DB.Model(board).Order("Name").Preload("Tags").Association("Tasks").Find(&tasks)
	return
}

func (board *Board) GetTags() (tags []Tag, err error) {
	err = db.DB.Model(board).Association("Tags").Find(&tags)
	return
}

func (board *Board) GetStates() (states []State, err error) {
	err = db.DB.Model(board).Association("States").Find(&states)
	return
}

func (board *Board) GetTasks() (tasks []Task, err error) {
	err = db.DB.Model(board).Association("Tasks").Find(&tasks)
	return
}

func (board *Board) Update() error {
	result := db.DB.Model(board).Save(board)
	return result.Error
}

func (board *Board) Delete() error {
	tasks, err := board.GetTasks()
	if err != nil {
		return err
	}

	for _, task := range tasks {
		err = task.Delete()
		if err != nil {
			return err
		}
	}

	states, err := board.GetStates()
	for _, state := range states {
		err = state.Delete()
		if err != nil {
			return err
		}
	}

	result := db.DB.Where(&Tag{BoardID: board.ID}).Delete(Tag{})

	if result.Error != nil {
		return result.Error
	}
	result = db.DB.Delete(board)
	return result.Error
}
