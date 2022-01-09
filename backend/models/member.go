package models

type Member struct {
	ID     uint8    `gorm:"primary_key" json:"id"`
	Role   Role     `gorm:"not null" json:"role"`
	UserID *uint8   `json:"userId"`                                      // User ID of the board member
	Boards []*Board `gorm:"many2many:board_members" json:"boardMembers"` // Boards that the member belongs to
}

type MemberPrimitive struct {
	ID     uint8  `json:"id"`
	Role   Role   `json:"role"`
	UserID *uint8 `json:"userId"` // User ID of the board member
}
