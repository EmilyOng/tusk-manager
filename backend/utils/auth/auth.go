package utils

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/EmilyOng/cvwo/backend/models"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type JWTAuth struct {
	SecretKey string
}

type Claim struct {
	jwt.StandardClaims
	UserID    uint8
	UserName  string
	UserEmail string
}

func GetSecretKey() (secretKey string, err error) {
	err = godotenv.Load()

	if err != nil {
		log.Fatalln("Error loading .env file")
		return
	}

	secretKey = os.Getenv("AUTH_SECRET_KEY")
	return
}

func (j *JWTAuth) GenerateToken(user models.UserPrimitive) (signedToken string, err error) {
	// Token expires in 24 hours
	claims := &Claim{
		UserID:    user.ID,
		UserName:  user.Name,
		UserEmail: user.Email,
		StandardClaims: jwt.StandardClaims{
			// Express in unix milliseconds
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err = token.SignedString([]byte(j.SecretKey))
	return
}

func (j *JWTAuth) ValidateToken(signedToken string) (claims *Claim, err error) {
	token, err := jwt.ParseWithClaims(signedToken, &Claim{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(j.SecretKey), nil
	})
	if err != nil {
		return
	}

	claims, valid := token.Claims.(*Claim)
	if !valid {
		err = errors.New("cannot parse claims")
		return
	}
	if claims.ExpiresAt < time.Now().Local().Unix() {
		err = errors.New("token has expired")
		return
	}
	return
}

func HashPassword(password string) (hashed string, err error) {
	// uses hashing cost of 10
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return
	}
	hashed = string(bytes)
	return
}

func ComparePassword(userPassword string, passwordInput string) (err error) {
	err = bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(passwordInput))
	return
}
