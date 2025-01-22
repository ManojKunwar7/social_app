package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID         primitive.ObjectID `json:"_id" bson:"_id"`
	Email      string             `json:"email"`
	PhoneNo    string             `json:"phone_no"`
	UserName   string             `json:"username"`
	LastName   string             `json:"last_name"`
	Password   string             `json:"password"`
	FirstName  string             `json:"first_name"`
	Created_at primitive.DateTime `json:"created_at" bson:"created_at"`
	Updated_at primitive.DateTime `json:"updated_at" bson:"updated_at"`
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

type AuthModuleInterface interface {
	LoginModule(UserLoginPayload) Func_resp
	RegisterModule(UserRegisterPayload) Func_resp
}
