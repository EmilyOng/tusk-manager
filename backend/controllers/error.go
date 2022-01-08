package controllers

import "errors"

var (
	error_UNEXPECTED   error = errors.New("an unexpected error has occurred")
	error_UNAUTHORIZED error = errors.New("unauthorized")

	// auth service
	error_INVALID_EMAIL    error = errors.New("invalid email address")
	error_INVALID_PASSWORD error = errors.New("invalid password")
	error_USER_EXISTS      error = errors.New("user already exists")
)
