package services

import (
	"fmt"

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
	var memberIds []int
	err := db.DB.Model(&models.Member{}).Where("user_id = ?", userId).Select("id").Find(&memberIds).Error
	fmt.Println(memberIds)
	if err != nil {
		return boards, err
	}
	db.DB.Raw(`
		SELECT boards.id, boards.name, boards.color
			FROM boards
			JOIN board_members ON 
				board_members.board_id = boards.id AND
				board_members.member_id IN ? ORDER BY boards.id
	`, memberIds).Scan(&boards)
	return boards, err
}
