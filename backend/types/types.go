package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type TokenPayload struct {
	SessionID string `json:"session_id"`
}

type User struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Email       string             `json:"email"`
	Phone_No    string             `json:"phone_no"`
	User_Name   string             `json:"user_name"`
	Last_Name   string             `json:"last_name"`
	Password    string             `json:"password"`
	Profile_Pic string             `json:"profile_pic"`
	First_Name  string             `json:"first_name"`
	Created_at  primitive.DateTime `json:"created_at" bson:"created_at"`
	Updated_at  primitive.DateTime `json:"updated_at" bson:"updated_at"`
}

type UserProfile struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Email       string             `json:"email"`
	Phone_No    string             `json:"phone_no"`
	User_Name   string             `json:"user_name"`
	Last_Name   string             `json:"last_name"`
	First_Name  string             `json:"first_name"`
	Profile_Pic string             `json:"profile_pic"`
	Created_at  primitive.DateTime `json:"created_at" bson:"created_at"`
	Updated_at  primitive.DateTime `json:"updated_at" bson:"updated_at"`
}

type UserLoginPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserRegisterPayload struct {
	Email           string `json:"email" validate:"required,email"`
	PhoneNo         string `json:"phone_no" validate:"required,min=8,max=20"`
	LastName        string `json:"last_name" validate:"required"`
	Password        string `json:"password" validate:"required,min=8,max=40"`
	FirstName       string `json:"first_name" validate:"required"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8,max=40"`
}

type Func_resp struct {
	Status       bool   `json:"status"`
	Data         []any  `json:"data"`
	Alert_status string `json:"alert_status"`
	C_msg        string `json:"c_msg"`
}

type LoginModuleResp struct {
	Status       bool
	Alert_status string
	C_msg        string
}

type AuthModuleInterface interface {
	LoginModule(UserLoginPayload, *UserProfile) LoginModuleResp
	RegisterModule(UserRegisterPayload) Func_resp
	FindUserByEmail(email string) ([]User, error)
	CheckToken(sessionID string) (UserProfile, error)
}

type ProfileModuleInterface interface {
	SearchProfileByQuery(query string) ([]UserProfile, error)
}

type ChatModuleInterface interface {
	GetConversationHistory(user_id primitive.ObjectID)
	GetPreviousChat(user_id primitive.ObjectID)
	SendChatTextMsg(text string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID)
	SendChatMediaMsg(link []string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID)
}
