package models

type Member struct {
	ID      uint8  `gorm:"primary_key" json:"id"`
	Role    Role   `gorm:"not null" json:"role" ts_type:"Role"`
	UserID  *uint8 `json:"userId"`  // User ID of the board member
	BoardID *uint8 `json:"boardId"` // Board that the member belongs to
}

type MemberPrimitive struct {
	ID      uint8  `json:"id"`
	Role    Role   `json:"role" ts_type:"Role"`
	UserID  *uint8 `json:"userId"`  // User ID of the board member
	BoardID *uint8 `json:"boardId"` // Board that the member belongs to
}

type MemberProfile struct {
	ID      uint8   `json:"id"`
	Role    Role    `json:"role" ts_type:"Role"`
	Profile Profile `json:"profile"`
}
