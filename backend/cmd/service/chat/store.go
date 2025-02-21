package chat

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type chatStore struct {
	mongo_client *mongo.Client
}

func NewStore(mongo_client *mongo.Client) *chatStore {
	return &chatStore{
		mongo_client: mongo_client,
	}
}

func (store *chatStore) GetConversationHistory(user_id primitive.ObjectID) {}
func (store *chatStore) GetPreviousChat(user_id primitive.ObjectID)        {}
func (store *chatStore) SendChatTextMsg(text string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID) {
}
func (store *chatStore) SendChatMediaMsg(link []string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID) {
}
