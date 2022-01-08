package utils

import "github.com/EmilyOng/cvwo/backend/models"

func GetDefaultColors() []models.Color {
	return []models.Color{models.Turquoise, models.Blue, models.Cyan, models.Green, models.Red, models.Yellow}
}

func GetDefaultStates() []string {
	return []string{"To Do", "In Progress", "Completed"}
}
