package models

import (
	"fmt"
	"main/db"
	"time"
)

// Generates sample seed data
func SeedData(currentUser User) (err error) {
	var categories []Category

	for i := 0; i < 10; i++ {
		categories = append(categories, Category{
			Name:  "Category-" + fmt.Sprint(i),
			Color: "", // TODO: Define color types
		})
	}

	res := db.DB.Create(&categories)
	if err = res.Error; err != nil {
		return
	}

	var tags []Tag

	for i := 0; i < 3; i++ {
		tags = append(tags, Tag{
			Name: "Tag-" + fmt.Sprint(i),
		})
	}

	res = db.DB.Create(&tags)
	if err = res.Error; err != nil {
		return
	}

	var tasks []Task

	for _, category := range categories {
		tasks = append(tasks, Task{
			Name:        "Sample Task",
			Description: "The quick brown fox jumps over the lazy dog",
			DueAt:       time.Now().Add(3 * time.Hour),
			State:       Unstarted,
			Owner:       currentUser,
			Tags:        tags,
			Category:    category,
		})
	}

	// Avoid creating multiple records of already-created user
	res = db.DB.Omit("Owner").Create(&tasks)
	if err = res.Error; err != nil {
		return
	}

	return
}
