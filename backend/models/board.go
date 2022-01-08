package models

type Board struct {
	ID     uint8    `gorm:"primary_key" json:"id"`
	Name   string   `gorm:"not null" json:"name"`
	Color  Color    `gorm:"not null" json:"color" ts_type:"Color"`
	Tasks  []*Task  `gorm:"not null" json:"tasks"`  // Tasks belonging to the board
	Tags   []*Tag   `gorm:"not null" json:"tags"`   // Tags belonging to the board
	States []*State `gorm:"not null" json:"states"` // States belonging to the board
	UserID *uint8   `json:"userId"`                 // Refers to the owner of the board
}

type BoardPrimitive struct {
	ID     uint8  `json:"id"`
	Name   string `json:"name"`
	Color  Color  `json:"color" ts_type:"Color"`
	UserID *uint8 `json:"userId"`
}

// Get Board
type GetBoardPayload struct {
	ID uint8 `json:"id"`
}

type GetBoardResponse struct {
	Response
	Board Board `json:"data"`
}

// Create Board
type CreateBoardPayload struct {
	Name   string `json:"name"`
	Color  Color  `json:"color" ts_type:"Color"`
	UserID uint8  `json:"userId"`
}

type CreateBoardResponse struct {
	Response
	Board BoardPrimitive `json:"data"`
}

// Update Board
type UpdateBoardPayload struct {
	ID     uint8  `json:"id"`
	Name   string `json:"name"`
	Color  Color  `json:"color" ts_type:"Color"`
	UserID uint8  `json:"userId"`
}

type UpdateBoardResponse struct {
	Response
	Board BoardPrimitive `json:"data"`
}

// Get Board Tasks
type GetBoardTasksPayload struct {
	BoardID uint8 `json:"boardId"`
}

type GetBoardTasksResponse struct {
	Response
	Tasks []Task `json:"data"`
}

// Get Board Tags
type GetBoardTagsPayload struct {
	BoardID uint8 `json:"boardId"`
}

type GetBoardTagsResponse struct {
	Response
	Tags []TagPrimitive `json:"data"`
}

// Get Board States
type GetBoardStatesPayload struct {
	BoardID uint8 `json:"boardId"`
}

type GetBoardStatesResponse struct {
	Response
	States []StatePrimitive `json:"data"`
}

// Delete Board
type DeleteBoardPayload struct {
	ID uint8 `json:"id"`
}

type DeleteBoardResponse struct {
	Response
}
