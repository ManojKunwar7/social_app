package redis

import "github.com/redis/go-redis/v9"

type RedisConnOptions struct {
	Addr     string
	Username string
	Password string
	DB       int
	Protocol int
}

func RedisConn(ops RedisConnOptions) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     ops.Addr,
		Username: ops.Username,
		Password: ops.Password, // No password set
		DB:       ops.DB,       // Use default DB
		Protocol: ops.Protocol, // Connection protocol
	})
	return client
}
