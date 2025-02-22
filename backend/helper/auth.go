package helper

import (
	"context"
	"fmt"

	"github.com/ManojKunwar7/social_app/backend/types"
	"github.com/redis/go-redis/v9"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

func CompareBcryptPassword(hashedPassword string, password string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return false, err
	}
	return true, nil
}

func ConvertPaswordToHashPassword(password string) (string, error) {
	hashpassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashpassword), nil
}

func CreateAuthSession(redisClient redis.Client, user types.UserProfile) (string, error) {
	sessionId := uuid.NewV4().String()
	_, err := redisClient.JSONSet(context.Background(), sessionId, "$", user).Result()
	if err != nil {
		fmt.Println("createauthsession-->", err.Error())
		return "", err
	}
	resp, err := redisClient.Expire(context.Background(), sessionId, 3600000000000*24).Result()
	fmt.Println("redis expiry ", resp, err)
	return sessionId, nil
}
