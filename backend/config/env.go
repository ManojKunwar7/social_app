package config

import (
	"fmt"
	"os"

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
