package models

type Tag struct {
	ID    uint8  `gorm:"primaryKey" json:"id"`
	Name  string `gorm:"not null" json:"name"`
	Tasks []Task `gorm:"many2many:task_tag"`
}
