package models

import (
	"errors"
	"main/db"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID       uint8    `gorm:"primaryKey" json:"id"`
	Name     string   `gorm:"not null" json:"name"`
	Email    string   `gorm:"not null" json:"email"`
	Password string   `gorm:"not null" json:"-"`
	Boards   []*Board `json:"-"` // Boards that the user owns
	Tasks    []*Task  `json:"-"` // Tasks that the user owns
}

func (user *User) Exist() bool {
	err := db.DB.Where(&User{Email: user.Email}).First(&user).Error
	return !errors.Is(err, gorm.ErrRecordNotFound)
}

func (user *User) Create() error {
	result := db.DB.Create(&user)
	return result.Error
}

func (user *User) HashPassword(password string) (err error) {
	// uses hashing cost of 10
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return
	}
	user.Password = string(bytes)
	return
}

func (user *User) CheckPassword(passwordInput string) (err error) {
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(passwordInput))
	return
}

func (user *User) GetBoards() (boards []Board, err error) {
	err = db.DB.Model(user).Association("Boards").Find(&boards)
	return
}
