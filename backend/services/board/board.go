package services

import (
	"github.com/EmilyOng/cvwo/backend/db"
	"github.com/EmilyOng/cvwo/backend/models"
	memberService "github.com/EmilyOng/cvwo/backend/services/member"
	stateService "github.com/EmilyOng/cvwo/backend/services/state"
	taskService "github.com/EmilyOng/cvwo/backend/services/task"
	errorUtils "github.com/EmilyOng/cvwo/backend/utils/error"
)

func CreateBoard(payload models.CreateBoardPayload) models.CreateBoardResponse {
	owner := models.Member{
		Role:   models.Owner,
		UserID: &payload.UserID,
	}
	board := models.Board{Name: payload.Name, Color: payload.Color, Members: []*models.Member{&owner}}
	result := db.DB.Create(&board)
	return models.CreateBoardResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		Board: models.BoardPrimitive{
			ID:    board.ID,
			Name:  board.Name,
			Color: board.Color,
		},
	}
}

func GetBoard(payload models.GetBoardPayload) models.GetBoardResponse {
	board := models.Board{ID: payload.ID}
	result := db.DB.Where(&board).First(&board)
	return models.GetBoardResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		Board: models.BoardPrimitive{
			ID:    board.ID,
			Name:  board.Name,
			Color: board.Color,
		},
	}
}

func GetBoardTasks(payload models.GetBoardTasksPayload) models.GetBoardTasksResponse {
	board := models.Board{ID: payload.BoardID}
	var tasks []models.Task
	err := db.DB.Model(&board).Order("tasks.name").Preload("Tags").Association("Tasks").Find(&tasks)
	return models.GetBoardTasksResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		Tasks:    tasks,
	}
}

func GetBoardTags(payload models.GetBoardTagsPayload) models.GetBoardTagsResponse {
	board := models.Board{ID: payload.BoardID}
	var tags []models.TagPrimitive
	err := db.DB.Model(&board).Order("tags.id").Association("Tags").Find(&tags)
	return models.GetBoardTagsResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		Tags:     tags,
	}
}

func GetBoardStates(payload models.GetBoardStatesPayload) models.GetBoardStatesResponse {
	board := models.Board{ID: payload.BoardID}
	var states []models.StatePrimitive
	err := db.DB.Model(&board).Order("states.current_position").Association("States").Find(&states)
	return models.GetBoardStatesResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		States:   states,
	}
}

func GetBoardMemberProfiles(payload models.GetBoardMemberProfilesPayload) models.GetBoardMemberProfilesResponse {
	board := models.Board{ID: payload.BoardID}
	var members []models.MemberPrimitive
	err := db.DB.Model(&board).Association("Members").Find(&members)
	if err != nil {
		return models.GetBoardMemberProfilesResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(err)},
		}
	}
	var memberProfiles []models.MemberProfile
	for _, member := range members {
		memberProfile, err := memberService.MakeMemberProfile(member)
		if err != nil {
			return models.GetBoardMemberProfilesResponse{
				Response: models.Response{Error: errorUtils.MakeErrStr(err)},
			}
		}
		memberProfiles = append(memberProfiles, memberProfile)
	}
	return models.GetBoardMemberProfilesResponse{
		Response:       models.Response{Error: errorUtils.MakeErrStr(err)},
		MemberProfiles: memberProfiles,
	}
}

func UpdateBoard(payload models.UpdateBoardPayload) models.UpdateBoardResponse {
	board := models.Board{ID: payload.ID, Name: payload.Name, Color: payload.Color}
	result := db.DB.Model(&models.Board{ID: board.ID}).Save(&board)
	return models.UpdateBoardResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		Board: models.BoardPrimitive{
			ID:    board.ID,
			Name:  board.Name,
			Color: board.Color,
		},
	}
}

func DeleteBoard(payload models.DeleteBoardPayload) models.DeleteBoardResponse {
	board := models.Board{ID: payload.ID}
	tasksResponse := GetBoardTasks(models.GetBoardTasksPayload{BoardID: payload.ID})
	if len(tasksResponse.Error) > 0 {
		return models.DeleteBoardResponse{
			Response: models.Response{Error: tasksResponse.Error},
		}
	}

	for _, task := range tasksResponse.Tasks {
		deleteTaskResponse := taskService.DeleteTask(models.DeleteTaskPayload{ID: task.ID})
		if len(deleteTaskResponse.Error) > 0 {
			return models.DeleteBoardResponse{
				Response: models.Response{Error: deleteTaskResponse.Error},
			}
		}
	}

	statesReponse := GetBoardStates(models.GetBoardStatesPayload{BoardID: payload.ID})
	if len(statesReponse.Error) > 0 {
		return models.DeleteBoardResponse{
			Response: models.Response{Error: statesReponse.Error},
		}
	}
	for _, state := range statesReponse.States {
		deleteStateResponse := stateService.DeleteState(models.DeleteStatePayload{ID: state.ID})
		if len(deleteStateResponse.Error) > 0 {
			return models.DeleteBoardResponse{
				Response: models.Response{Error: deleteStateResponse.Error},
			}
		}
	}

	result := db.DB.Where(&models.Tag{BoardID: &board.ID}).Delete(models.Tag{})

	if result.Error != nil {
		return models.DeleteBoardResponse{
			Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
		}
	}
	result = db.DB.Delete(&board)
	return models.DeleteBoardResponse{
		Response: models.Response{Error: errorUtils.MakeErrStr(result.Error)},
	}
}
