package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
)

type JWTAuth struct {
	SecretKey string
}

type Claim struct {
	jwt.StandardClaims
	Name  string
	Email string
}

func (j *JWTAuth) GenerateToken(name string, email string) (signedToken string, err error) {
	// Token expires in 24 hours
	claims := &Claim{
		Name:  name,
		Email: email,
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
