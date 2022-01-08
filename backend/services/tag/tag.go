package services

import (
	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
)

func CreateTag(payload models.CreateTagPayload) models.CreateTagResponse {
	tag := models.Tag{Name: payload.Name, Color: payload.Color, BoardID: &payload.BoardID}
	result := db.DB.Create(&tag)
	return models.CreateTagResponse{
		Response: models.Response{Error: result.Error},
		Tag:      models.TagPrimitive{ID: tag.ID, Name: tag.Name, Color: tag.Color, BoardID: tag.BoardID},
	}
}

func DeleteTag(payload models.DeleteTagPayload) models.DeleteTagResponse {
	tag := models.Tag{ID: payload.ID}
	result := db.DB.Model(&tag).Preload("Tasks").Find(&tag)
	if result.Error != nil {
		return models.DeleteTagResponse{
			Response: models.Response{Error: result.Error},
		}
	}
	err := db.DB.Model(&tag).Association("Tasks").Delete(&tag.Tasks)
	if err != nil {
		return models.DeleteTagResponse{
			Response: models.Response{Error: err},
		}
	}
	result = db.DB.Delete(&tag)
	return models.DeleteTagResponse{
		Response: models.Response{Error: result.Error},
	}
}

func UpdateTag(payload models.UpdateTagPayload) models.UpdateTagResponse {
	tag := models.Tag{ID: payload.ID, Name: payload.Name, BoardID: &payload.BoardID, Color: payload.Color}
	result := db.DB.Model(&models.Tag{ID: tag.ID}).Save(&tag)
	return models.UpdateTagResponse{
		Response: models.Response{Error: result.Error},
		Tag:      models.TagPrimitive{ID: tag.ID, Name: tag.Name, BoardID: tag.BoardID, Color: tag.Color},
	}
}
