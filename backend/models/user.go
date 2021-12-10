package models

type User struct {
	ID       uint8  `gorm:"primaryKey"`
	Name     string `gorm:"not null"`
	Email    string `gorm:"not null"`
	Password string `gorm:"not null"`
	Tasks    []Task `gorm:"many2many:user_task"`
}
