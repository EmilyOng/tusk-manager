package utils

import (
	"net/http"

	"github.com/EmilyOng/cvwo/backend/models"
)

func MakeErrStr(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}

func MakeResponseCode(response models.Response) int {
	if len(response.Error) == 0 {
		return http.StatusOK
	}
	return http.StatusInternalServerError
}
