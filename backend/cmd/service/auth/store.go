package auth

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/ManojKunwar7/social_app/backend/helper"
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
	user, err := client.FindUserByEmail(payload.Email)
	if err != nil || len(user) <= 0 {
		return types.Func_resp{
			Status:       false,
			Data:         []any{},
			Alert_status: "error",
			C_msg:        "Email or password not found!",
		}
	}
	fmt.Printf("%q \n", user)
	user_profile := user[0]
	if _, err := helper.CompareBcryptPassword(user_profile.Password, payload.Password); err != nil {
		return types.Func_resp{
			Status:       false,
			Data:         []any{},
			Alert_status: "error",
			C_msg:        "Email or password not found!",
		}
	}
	user_profile.Password = ""
	return types.Func_resp{
		Status:       true,
		Data:         []any{user_profile},
		Alert_status: "success",
		C_msg:        "Logded in!",
	}
}

func (client *authStore) RegisterModule(payload types.UserRegisterPayload) types.Func_resp {
	var tm time.Time = time.Now()
	// var user_name string = fmt.Sprintf("%v_%v", payload.FirstName, payload.LastName)
	var user_name string = client.ValidateUserName(payload.Email)
	fmt.Printf("%s", user_name)
	doc := bson.M{
		"first_name": payload.FirstName,
		"phone_no":   payload.PhoneNo,
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
	fmt.Println("This is insert resp \n", resp)
	return types.Func_resp{
		Status:       true,
		Data:         []any{map[string]any{"status": true}},
		Alert_status: "success",
		C_msg:        "Hey Testing!",
	}

}

func (client *authStore) ValidateUserName(email string) string {

	var user_name string = fmt.Sprintf("%s%d", strings.TrimRight(strings.Split(email, "@")[0], "@"), rand.Intn(7*10000))
	user, err := client.FindUserByUserName(user_name)
	if err != nil {
		return ""
	}
	if len(user) > 0 {
		user_name = client.ValidateUserName(email)
		return user_name
	}
	return user_name
}

func (client *authStore) FindUserByUserName(user_name string) ([]types.User, error) {
	filter := bson.M{"user_name": user_name}
	cursor, err := client.mongo_client.Database("users").Collection("profile").Find(context.TODO(), filter)
	if err != nil {
		fmt.Printf("Error while fetching FindUserByUserName input %q : %s", user_name, err.Error())
		return []types.User{}, err
	}
	var result []types.User
	if err = cursor.All(context.TODO(), &result); err != nil {
		fmt.Printf("%s", err.Error())
		return []types.User{}, err
	}
	return result, nil
}

func (client *authStore) FindUserByEmail(email string) ([]types.User, error) {
	var filter bson.M = bson.M{"email": email}
	cursor, err := client.mongo_client.Database("users").Collection("profile").Find(context.TODO(), filter)
	if err != nil {
		return []types.User{}, err
	}
	var results []types.User
	if err := cursor.All(context.TODO(), &results); err != nil {
		return []types.User{}, err
	}
	return results, nil
}

func (client *authStore) InsertUser(payload types.UserRegisterPayload) types.Func_resp {

	return types.Func_resp{}
}
