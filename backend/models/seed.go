package models

import (
	"fmt"
	"main/db"
	"time"
)

// Generates sample seed data
func SeedData(user *User) (err error) {
	var tags []Tag
	var categories []Category
	var tasks []*Task

	// Create sample categories
	for i := 0; i < 10; i++ {
		categories = append(categories, Category{
			Name:   "Category-" + fmt.Sprint(i),
			UserID: user.ID,
		})
	}

	res := db.DB.Create(&categories)
	if err = res.Error; err != nil {
		return
	}

	// Create sample tags
	for i := 0; i < 3; i++ {
		tags = append(tags, Tag{
			Name: "Tag-" + fmt.Sprint(i),
		})
	}

	res = db.DB.Create(&tags)
	if err = res.Error; err != nil {
		return
	}

	// Handle associations to tasks
	for _, category := range categories {
		tasks = nil
		for i := 0; i < 10; i++ {
			tasks = append(tasks, &Task{
				Name:        "Sample Task-" + fmt.Sprint(i),
				Description: "The quick brown fox jumps over the lazy dog",
				DueAt:       time.Now().Add(3 * time.Hour),
				State:       Unstarted,
				Tags:        tags,
				UserID:      user.ID,
				CategoryID:  category.ID,
			})
		}
		res = db.DB.Create(&tasks)
		if err = res.Error; err != nil {
			return
		}
	}
	return
}
