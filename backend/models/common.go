package models

type Color string

const (
	Turquoise Color = "Turquoise"
	Blue      Color = "Blue"
	Cyan      Color = "Cyan"
	Green     Color = "Green"
	Yellow    Color = "Yellow"
	Red       Color = "Red"
)

type Role string

const (
	Owner  Role = "Owner"
	Editor Role = "Editor"
	Viewer Role = "Viewer"
)

type Response struct {
	Error string `json:"error"`
}
