package services

import (
	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
)

func CreateUser(user models.UserPrimitive) (models.UserPrimitive, error) {
	u := models.User{
		ID:       user.ID,
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
	}
	result := db.DB.Model(&models.User{}).Create(&u)
	return models.UserPrimitive{
		ID:       u.ID,
		Name:     u.Name,
		Email:    u.Email,
		Password: u.Password,
	}, result.Error
}

func GetUserBoards(userId uint8) ([]models.BoardPrimitive, error) {
	var boards []models.BoardPrimitive
	err := db.DB.Model(&models.User{ID: userId}).Order("boards.id").Association("Boards").Find(&boards)
	return boards, err
}
