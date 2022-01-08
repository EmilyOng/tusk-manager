package models

type Tag struct {
	ID      uint8   `gorm:"primaryKey" json:"id"`
	Name    string  `gorm:"not null" json:"name"`
	Color   Color   `gorm:"not null" json:"color" ts_type:"Color"`
	Tasks   []*Task `gorm:"many2many:task_tags" json:"tasks"`
	BoardID *uint8  `json:"boardId"` // Board that the tag belongs to
}

type TagPrimitive struct {
	ID      uint8  `json:"id"`
	Name    string `json:"name"`
	Color   Color  `json:"color" ts_type:"Color"`
	BoardID *uint8 `json:"boardId"`
}

// Create Tag
type CreateTagPayload struct {
	Name    string `json:"name"`
	Color   Color  `json:"color" ts_type:"Color"`
	BoardID uint8  `json:"boardId"`
}

type CreateTagResponse struct {
	Response
	Tag TagPrimitive `json:"data"`
}

// Update Tag
type UpdateTagPayload struct {
	ID      uint8  `json:"id"`
	Name    string `json:"name"`
	BoardID uint8  `json:"boardId"`
	Color   Color  `json:"color" ts_type:"Color"`
}

type UpdateTagResponse struct {
	Response
	Tag TagPrimitive `json:"data"`
}

// Delete Tag
type DeleteTagPayload struct {
	ID uint8 `json:"id"`
}

type DeleteTagResponse struct {
	Response
}
