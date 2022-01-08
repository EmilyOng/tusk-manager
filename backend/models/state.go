package models

type State struct {
	ID              uint8   `gorm:"primaryKey" json:"id"`
	Name            string  `gorm:"not null" json:"name"`
	CurrentPosition int     `gorm:"not null" json:"currentPosition"` // Sort key
	Tasks           []*Task `gorm:"not null" json:"tasks"`           // Tasks belonging to the state
	BoardID         *uint8  `json:"boardId"`                         // Board that the state belongs to
}

type StatePrimitive struct {
	ID              uint8  `json:"id"`
	Name            string `json:"name"`
	CurrentPosition int    `json:"currentPosition"`
	BoardID         *uint8 `json:"boardId"`
}

// Create State
type CreateStatePayload struct {
	Name            string `json:"name"`
	BoardID         uint8  `json:"boardId"`
	CurrentPosition int    `json:"currentPosition"`
}

type CreateStateResponse struct {
	Response
	State State `json:"data"`
}

// Update State
type UpdateStatePayload struct {
	ID              uint8  `json:"id"`
	Name            string `json:"name"`
	BoardID         uint8  `json:"boardId"`
	CurrentPosition int    `json:"currentPosition"`
}

type UpdateStateResponse struct {
	Response
	State StatePrimitive `json:"data"`
}

// Delete State
type DeleteStatePayload struct {
	ID uint8 `json:"id"`
}

type DeleteStateResponse struct {
	Response
}
