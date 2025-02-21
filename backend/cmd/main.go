package main

import (
	"context"
	"fmt"
	"log"

	"github.com/ManojKunwar7/social_app/backend/cmd/api"
	"github.com/ManojKunwar7/social_app/backend/config"
	"github.com/ManojKunwar7/social_app/backend/db/mongodb"
	"github.com/ManojKunwar7/social_app/backend/db/redis"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func main() {
	config.InitEnv()
	// * MongoDB url
	mongodb_url := config.Create_MongoDB_URL()
	mongodb_client, err := mongodb.GetMongoConn(mongodb_url)
	if err != nil {
		log.Panicf("MongoDB Connection Error %v\n", err.Error())
		log.Panicf("Unable to connect mongodb on %v\n", mongodb_url)
		return
	}
	defer func() {
		if err = mongodb_client.Disconnect(context.TODO()); err != nil {
			log.Panic(err)
		}
	}()

	if err = mongodb_client.Ping(context.TODO(), readpref.Primary()); err != nil {
		log.Panicf("Unable to connect mongodb on %v\n", mongodb_url)
		log.Panic(err)
	}
	fmt.Printf("MongoDB Conn %q\n", mongodb_url)

	// ! Redis Client
	redis_option := config.Create_Redis_Options()
	redis_client := redis.RedisConn(redis_option)

	server := api.NewAPIServer(":3000", mongodb_client, redis_client)
	if err := server.Run(); err != nil {
		log.Panicln(err.Error())
	}
}
