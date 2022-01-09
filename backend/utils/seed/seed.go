package models

import (
	"fmt"
	"time"

	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	commonUtils "github.com/EmilyOng/cvwo/backend/utils/common"
)

// Generates sample seed data
func SeedData(user *models.UserPrimitive) (err error) {
	var boards []models.Board

	colors := commonUtils.GetDefaultColors()

	// Create sample boards
	for i := 0; i < 10; i++ {
		var tags []*models.Tag
		var tasks []*models.Task
		var states []*models.State

		// Create sample states for the current board
		for i, state := range commonUtils.GetDefaultStates() {
			states = append(states, &models.State{
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
			tags = append(tags, &models.Tag{
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
			tasks = append(tasks, &models.Task{
				Name:        "Sample Task-" + fmt.Sprint(i),
				Description: "The quick brown fox jumps over the lazy dog",
				DueAt:       &t,
				Tags:        tags,
				UserID:      &user.ID,
				StateID:     &states[i%3].ID,
			})
		}
		res = db.DB.Create(&tasks)
		if err = res.Error; err != nil {
			return
		}

		owner := models.Member{
			Role:   models.Owner,
			UserID: &user.ID,
		}
		boards = append(boards, models.Board{
			Name:    "Board-" + fmt.Sprint(i),
			Color:   colors[i%6],
			Tags:    tags,
			Tasks:   tasks,
			States:  states,
			Members: []*models.Member{&owner},
		})
	}

	res := db.DB.Create(&boards)
	if err = res.Error; err != nil {
		return
	}

	return
}
