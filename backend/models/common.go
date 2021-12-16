package models

import (
	"time"
)

type CommonModel struct {
	ID        uint8      `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
}

type Color string

const (
	Turquoise Color = "Turquoise"
	Blue      Color = "Blue"
	Cyan      Color = "Cyan"
	Green     Color = "Green"
	Yellow    Color = "Yellow"
	Red       Color = "Red"
)
