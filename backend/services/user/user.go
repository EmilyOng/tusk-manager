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
	var boardIds []int
	err := db.DB.Model(&models.Member{}).Where("user_id = ?", userId).Select("board_id").Find(&boardIds).Error
	if err != nil {
		return boards, err
	}
	err = db.DB.Model(&models.Board{}).Where("id IN ?", boardIds).Find(&boards).Error
	return boards, err
}
