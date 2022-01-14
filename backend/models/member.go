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

// Create Member
type CreateMemberPayload struct {
	Role    Role   `json:"role" ts_type:"Role"`
	Email   string `json:"email"` // Invitation is by email
	BoardID uint8  `json:"boardId"`
}

type CreateMemberResponse struct {
	Response
	MemberProfile MemberProfile `json:"data"`
}

// Update Member
type UpdateMemberPayload struct {
	ID   uint8 `json:"id"`
	Role Role  `json:"role" ts_type:"Role"`
}

type UpdateMemberResponse struct {
	Response
	MemberProfile MemberProfile `json:"data"`
}

// Delete Member
type DeleteMemberPayload struct {
	ID uint8 `json:"id"`
}

type DeleteMemberResponse struct {
	Response
}
