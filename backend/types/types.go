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

type ConversationHistoryPayload struct {
	UserID primitive.ObjectID `json:"user_id" validate:"required"`
}

type ConversationHistory struct {
	ConversationID primitive.ObjectID `json:"_id"`
	Msg            string             `json:"msg"`
	SenderId       primitive.ObjectID `json:"sender_id"`
	SenderName     string             `json:"sender_name"`
	ReceiverId     primitive.ObjectID `json:"receiver_id"`
	ReceiverName   string             `json:"receiver_name"`
	CreatorId      primitive.ObjectID `json:"creator_id"`
	LastMsgByID    primitive.ObjectID `json:"last_msg_by_id"`
	MsgTimestamp   primitive.DateTime `json:"msg_timestamp"`
	CreatedAt      primitive.DateTime `json:"created_at"`
}

type ChatHistoryPayload struct {
	ConversationID primitive.ObjectID `json:"conversation_id" validate:"required"`
}

type SendTextChatPayload struct {
	ConversationID primitive.ObjectID `json:"conversation_id"`
	Msg            string             `json:"msg" validate:"required"`
	SenderId       primitive.ObjectID `json:"sender_id"`
	ReceiverId     primitive.ObjectID `json:"receiver_id"`
	UserID         primitive.ObjectID `json:"user_id"`
}

type SendMediaChatPayload struct {
}

type FileType struct {
	FileName  string             `json:"file_name"`
	MimeType  string             `json:"mime_type"`
	FileSize  uint               `json:"file_size"`
	FileType  string             `json:"file_type"`
	FileUrl   string             `json:"file_url"`
	Caption   string             `json:"caption"`
	CreatedAt primitive.DateTime `json:"created_at"`
}

type EmojiObj struct {
	UserId    primitive.ObjectID `json:"user_id"`
	Reaction  string             `json:"reaction"`
	CreatedAt primitive.DateTime `json:"created_at"`
}

type ChatListItem struct {
	ID             primitive.ObjectID `json:"_id"`
	ConversationId primitive.ObjectID `json:"conversation_id"`
	UserID         primitive.ObjectID `json:"user_id"`
	SenderID       primitive.ObjectID `json:"sender_id"`
	ReceiverID     primitive.ObjectID `json:"receiver_id"`
	SenderName     string             `json:"sender_name"`
	ReceiverName   string             `json:"receiver_name"`
	Msg            string             `json:"msg"`
	File           FileType           `json:"file"`
	MsgType        string             `json:"msg_type"`
	Reaction       []EmojiObj         `json:"reaction"`
	CreatedAt      primitive.DateTime `json:"created_at"`
	UpdatedAt      primitive.DateTime `json:"updated_at"`
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
	CreateConversationHistory(conversation_obj ConversationHistory) (string, error)
	GetConversationHistory(user_id primitive.ObjectID) ([]ConversationHistory, error)
	GetConversationHistoryByID(conversation_id primitive.ObjectID) ([]ConversationHistory, error)
	GetPreviousChat(user_id primitive.ObjectID) ([]ChatListItem, error)
	SendChatTextMsg(text string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID)
	SendChatMediaMsg(link []string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID)
}
