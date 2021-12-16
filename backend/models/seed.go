package models

import (
	"fmt"
	"main/db"
	"time"
)

// Generates sample seed data
func SeedData(user *User) (err error) {
	var tags []Tag
	var boards []Board
	var tasks []*Task

	colors := []Color{Turquoise, Blue, Cyan, Green, Red, Yellow}

	// Create sample boards
	for i := 0; i < 10; i++ {
		boards = append(boards, Board{
			Name:   "Board-" + fmt.Sprint(i),
			UserID: user.ID,
			Color:  colors[i%6],
		})
	}

	res := db.DB.Create(&boards)
	if err = res.Error; err != nil {
		return
	}

	// Create sample tags
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

	// Handle associations to tasks
	for _, board := range boards {
		tasks = nil
		for i := 0; i < 10; i++ {
			tasks = append(tasks, &Task{
				Name:        "Sample Task-" + fmt.Sprint(i),
				Description: "The quick brown fox jumps over the lazy dog",
				DueAt:       time.Now().Add(3 * time.Hour),
				Tags:        tags,
				UserID:      user.ID,
				BoardID:     board.ID,
			})
		}
		res = db.DB.Create(&tasks)
		if err = res.Error; err != nil {
			return
		}
	}
	return
}
