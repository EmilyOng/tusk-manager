package services

import (
	"time"

	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	datetime "github.com/EmilyOng/cvwo/backend/utils/datetime"
	errorUtils "github.com/EmilyOng/cvwo/backend/utils/error"
)

func CreateTask(payload models.CreateTaskPayload) models.CreateTaskResponse {
	var tags []*models.Tag
	for _, tag := range payload.Tags {
		tags = append(tags, &models.Tag{
			ID:      tag.ID,
			Name:    tag.Name,
			Color:   tag.Color,
			BoardID: tag.BoardID,
		})
	}
	task := models.Task{
		Name:        payload.Name,
		Description: payload.Description,
		StateID:     &payload.StateID,
		Tags:        tags,
		BoardID:     &payload.BoardID,
		UserID:      &payload.UserID,
	}
	if len(payload.DueAt) > 0 {
		t, _ := time.Parse(datetime.DatetimeLayout, payload.DueAt)
		task.DueAt = &t
	}
	result := db.DB.Create(&task)
	return models.CreateTaskResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		Task:     task,
	}
}

func GetTask(taskId uint8) (models.Task, error) {
	task := models.Task{ID: taskId}
	result := db.DB.Model(&task).Preload("Tags").Find(&task)
	return task, result.Error
}

func UpdateTask(payload models.UpdateTaskPayload) models.UpdateTaskResponse {
	var tags []*models.Tag
	for _, tag := range payload.Tags {
		tags = append(tags, &models.Tag{
			ID:      tag.ID,
			Name:    tag.Name,
			Color:   tag.Color,
			BoardID: tag.BoardID,
		})
	}
	task := models.Task{
		ID:          payload.ID,
		Name:        payload.Name,
		Description: payload.Description,
		StateID:     &payload.StateID,
		Tags:        tags,
		BoardID:     &payload.BoardID,
		UserID:      &payload.UserID,
	}
	if len(payload.DueAt) > 0 {
		t, _ := time.Parse(datetime.DatetimeLayout, payload.DueAt)
		task.DueAt = &t
	}
	if len(task.Tags) != 0 {
		err := db.DB.Model(&task).Association("Tags").Replace(&task.Tags)
		if err != nil {
			return models.UpdateTaskResponse{
				Response: models.Response{Error: errorUtils.MakeErrStr(err)},
			}
		}
	}
	result := db.DB.Model(&task).Preload("Tags").Save(&task)
	return models.UpdateTaskResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		Task:     task,
	}
}

func DeleteTask(payload models.DeleteTaskPayload) models.DeleteTaskResponse {
	task, err := GetTask(payload.ID)
	if err != nil {
		return models.DeleteTaskResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		}
	}
	err = db.DB.Model(&task).Association("Tags").Delete(&task.Tags)
	if err != nil {
		return models.DeleteTaskResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		}
	}
	result := db.DB.Delete(&task)
	return models.DeleteTaskResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
	}
}
