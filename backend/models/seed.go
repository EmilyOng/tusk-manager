package models

import (
	"fmt"
	"main/db"
	"time"
)

// Generates sample seed data
func SeedData(user *User) (err error) {
	var boards []Board

	colors := []Color{Turquoise, Blue, Cyan, Green, Red, Yellow}

	// Create sample boards
	for i := 0; i < 10; i++ {
		var tags []Tag
		var tasks []Task
		var states []State

		// Create sample states for the current board
		for i, state := range GetDefaultStates() {
			states = append(states, State{
				Name:            state,
				CurrentPosition: i,
			})
		}

		res := db.DB.Create(&states)
		if err = res.Error; err != nil {
			return
		}

		// Create sample tags for the current board
		for i := 0; i < 7; i++ {
			tags = append(tags, Tag{
				Name:  "Tag-" + fmt.Sprint(i),
				Color: colors[i%6],
			})
		}

		res = db.DB.Create(&tags)
		if err = res.Error; err != nil {
			return
		}

		// Create sample tasks for the current board
		for i := 0; i < 10; i++ {
			t := time.Now().Add(24 * time.Hour)
			tasks = append(tasks, Task{
				Name:        "Sample Task-" + fmt.Sprint(i),
				Description: "The quick brown fox jumps over the lazy dog",
				DueAt:       &t,
				Tags:        &tags,
				UserID:      user.ID,
				StateID:     states[0].ID,
			})
		}
		res = db.DB.Create(&tasks)
		if err = res.Error; err != nil {
			return
		}

		boards = append(boards, Board{
			Name:   "Board-" + fmt.Sprint(i),
			UserID: user.ID,
			Color:  colors[i%6],
			Tags:   &tags,
			Tasks:  &tasks,
			States: &states,
		})
	}

	res := db.DB.Create(&boards)
	if err = res.Error; err != nil {
		return
	}

	return
}
