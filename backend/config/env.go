package config

import (
	"fmt"
	"os"

	"github.com/ManojKunwar7/social_app/backend/db/redis"
	"github.com/joho/godotenv"
)

func InitEnv() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}
	return nil
}

func Create_MongoDB_URL() string {
	var user_name string = os.Getenv("MONGODB_USER")
	var password string = os.Getenv("MONGODB_PASSWORD")
	var host string = os.Getenv("MONGODB_HOST")
	var port string = os.Getenv("MONGODB_PORT")
	var url string = "mongodb://"
	if user_name != "" && password != "" {
		url = fmt.Sprintf("%s%s:%s@", url, user_name, password)
	}
	url = fmt.Sprintf("%s%s:%s", url, host, port)
	url = fmt.Sprintf("%s", url)
	return url
}

func Create_Redis_Options() redis.RedisConnOptions {
	var user_name string = os.Getenv("REDIS_USER")
	var password string = os.Getenv("REDIS_PASSWORD")
	var host string = os.Getenv("REDIS_HOST")
	var port string = os.Getenv("REDIS_PORT")
	var addr = fmt.Sprintf("%s:%s", host, port)
	return redis.RedisConnOptions{
		Addr:     addr,
		Username: user_name,
		Password: password,
		DB:       0,
		Protocol: 2,
	}
}
