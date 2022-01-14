package services

import (
	"errors"

	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	errorUtils "github.com/EmilyOng/cvwo/backend/utils/error"
	"gorm.io/gorm"
)

func MakeMemberProfile(member models.MemberPrimitive) (memberProfile models.MemberProfile, err error) {
	var profile models.Profile
	err = db.DB.Model(&models.User{}).Where("id = ?", *member.UserID).Find(&profile).Error
	if err != nil {
		return
	}
	memberProfile = models.MemberProfile{
		ID:      member.ID,
		Role:    member.Role,
		Profile: profile,
	}
	return
}

func UpdateMember(payload models.UpdateMemberPayload) models.UpdateMemberResponse {
	var member models.Member
	result := db.DB.Model(&models.Member{}).Where("id = ?", payload.ID).Find(&member)

	if result.Error != nil {
		return models.UpdateMemberResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		}
	}
	member.Role = payload.Role
	result = db.DB.Model(&member).Save(&member)
	if result.Error != nil {
		return models.UpdateMemberResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		}
	}
	profile, err := MakeMemberProfile(models.MemberPrimitive(member))
	return models.UpdateMemberResponse{
		Response:      models.Response{Error: errorUtils.MakeErrStr(err)},
		MemberProfile: profile,
	}
}

func DeleteMember(payload models.DeleteMemberPayload) models.DeleteMemberResponse {
	var member models.Member
	result := db.DB.Model(&models.Member{}).Where("id = ?", payload.ID).Find(&member)
	if result.Error != nil {
		return models.DeleteMemberResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		}
	}

	err := db.DB.Model(&models.Board{}).Where("id = ?", *member.BoardID).Association("Members").Delete(member)
	if err != nil {
		return models.DeleteMemberResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		}
	}

	err = db.DB.Model(&models.User{}).Where("id = ?", *member.UserID).Association("Members").Delete(member)
	if err != nil {
		return models.DeleteMemberResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		}
	}
	result = db.DB.Debug().Delete(&member)
	return models.DeleteMemberResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
	}
}

func CreateMember(payload models.CreateMemberPayload) models.CreateMemberResponse {
	// Check validity of invitee's email
	var user models.UserPrimitive
	err := db.DB.Model(&models.User{}).Where("email = ?", payload.Email).First(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.CreateMemberResponse{
			Response: models.Response{Error: "Invalid email address"},
		}
	}

	// Check whether the member is existing
	var member_ models.MemberPrimitive
	err = db.DB.Model(&models.Member{}).Where("user_id = ? AND board_id = ?", user.ID, payload.BoardID).First(&member_).Error

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return models.CreateMemberResponse{
			Response: models.Response{Error: "Board is already shared with " + user.Name},
		}
	}

	m := models.Member{
		Role:    payload.Role,
		UserID:  &user.ID,
		BoardID: &payload.BoardID,
	}
	result := db.DB.Model(&models.Member{}).Create(&m)
	if result.Error != nil {
		return models.CreateMemberResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		}
	}

	profile, err := MakeMemberProfile(models.MemberPrimitive(m))
	return models.CreateMemberResponse{
		Response:      models.Response{Error: errorUtils.MakeErrStr(err)},
		MemberProfile: profile,
	}
}
