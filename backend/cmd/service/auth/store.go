package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/ManojKunwar7/social_app/backend/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type authStore struct {
	mongo_client *mongo.Client
}

func NewStore(mongo_client *mongo.Client) *authStore {
	return &authStore{
		mongo_client: mongo_client,
	}
}

func (client *authStore) LoginModule(payload types.UserLoginPayload) types.Func_resp {
	fmt.Printf("%q \n", payload.Email)
	fmt.Printf("%q \n", payload.Password)
	return types.Func_resp{
		Status:       true,
		Data:         []any{map[string]any{"status": true}},
		Alert_status: "success",
		C_msg:        "Hey Testing!",
	}
}

func (client *authStore) RegisterModule(payload types.UserRegisterPayload) types.Func_resp {
	var tm time.Time = time.Now()
	var user_name string = fmt.Sprintf("%v_%v", payload.FirstName, payload.LastName)
	doc := bson.M{
		"first_name": payload.LastName,
		"last_name":  payload.LastName,
		"user_name":  user_name,
		"email":      payload.Email,
		"password":   payload.Password,
		"created_at": tm,
		"updated_at": tm,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	resp, err := client.mongo_client.Database("users").Collection("profile").InsertOne(ctx, doc)
	if err != nil {
		return types.Func_resp{
			Status:       false,
			Data:         []any{},
			Alert_status: "error",
			C_msg:        err.Error(),
		}
	}
	fmt.Println("This is insert resp", resp)
	return types.Func_resp{
		Status:       true,
		Data:         []any{map[string]any{"status": true}},
		Alert_status: "success",
		C_msg:        "Hey Testing!",
	}

}

func (client *authStore) InsertUser(payload types.UserRegisterPayload) types.Func_resp {

	return types.Func_resp{}
}
