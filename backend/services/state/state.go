package services

import (
	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	taskService "github.com/EmilyOng/cvwo/backend/services/task"
)

func CreateState(payload models.CreateStatePayload) models.CreateStateResponse {
	state := models.State{Name: payload.Name, BoardID: &payload.BoardID, CurrentPosition: payload.CurrentPosition}
	result := db.DB.Create(&state)
	return models.CreateStateResponse{
		Response: models.Response{Error: result.Error},
		State:    state,
	}
}

func UpdateState(payload models.UpdateStatePayload) models.UpdateStateResponse {
	state := models.State{
		ID:              payload.ID,
		Name:            payload.Name,
		BoardID:         &payload.BoardID,
		CurrentPosition: payload.CurrentPosition,
	}
	result := db.DB.Model(&models.State{ID: state.ID}).Save(&state)
	return models.UpdateStateResponse{
		Response: models.Response{Error: result.Error},
		State: models.StatePrimitive{
			ID:              state.ID,
			Name:            state.Name,
			BoardID:         state.BoardID,
			CurrentPosition: state.CurrentPosition,
		},
	}
}

func DeleteState(payload models.DeleteStatePayload) models.DeleteStateResponse {
	state := models.State{ID: payload.ID}
	tasks, err := getStateTasks(payload.ID)
	if err != nil {
		return models.DeleteStateResponse{
			Response: models.Response{Error: err},
		}
	}
	for _, task := range tasks {
		deleteTaskResponse := taskService.DeleteTask(models.DeleteTaskPayload{ID: task.ID})
		if deleteTaskResponse.Error != nil {
			return models.DeleteStateResponse{
				Response: models.Response{Error: deleteTaskResponse.Error},
			}
		}
	}

	result := db.DB.Delete(&state)
	return models.DeleteStateResponse{
		Response: models.Response{Error: result.Error},
	}
}

func getStateTasks(stateID uint8) ([]models.TaskPrimitive, error) {
	state := models.State{ID: stateID}
	var tasks []models.TaskPrimitive
	err := db.DB.Model(&state).Association("Tasks").Find(&tasks)
	return tasks, err
}
