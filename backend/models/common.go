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

type Response struct {
	Error error `json:"error"`
}
