package models

type Tag struct {
	ID    uint8  `gorm:"primaryKey"`
	Name  string `gorm:"not null"`
	Tasks []Task `gorm:"many2many:task_tag"`
}
