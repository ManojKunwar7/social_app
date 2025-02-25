package chat

import (
	"context"

	"github.com/ManojKunwar7/social_app/backend/types"
	"go.mongodb.org/mongo-driver/bson"
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

func (store *chatStore) CreateConversationHistory(conversation_obj types.ConversationHistory) (string, error) {
	// ! Check before creating

	// ! If not then create
	return "", nil
}

func (store *chatStore) GetConversationHistory(user_id primitive.ObjectID) ([]types.ConversationHistory, error) {
	var filter bson.M = bson.M{"$or": []any{bson.M{"sender_id": user_id}, bson.M{"receiver_id": user_id}}}
	cursor, err := store.mongo_client.Database("chat").Collection("conversation_history").Find(context.TODO(), filter)
	var results []types.ConversationHistory

	if err != nil {
		return results, err
	}

	if err := cursor.All(context.TODO(), &results); err != nil {
		return results, nil
	}
	return results, nil
}

func (store *chatStore) GetConversationHistoryByID(conversation_id primitive.ObjectID) ([]types.ConversationHistory, error) {
	var filter bson.M = bson.M{"_id": conversation_id}
	cursor, err := store.mongo_client.Database("chat").Collection("conversation_history").Find(context.TODO(), filter)
	var results []types.ConversationHistory
	if err != nil {
		return results, err
	}
	if err := cursor.All(context.TODO(), &results); err != nil {
		return results, nil
	}
	return results, nil
}

func (store *chatStore) GetPreviousChat(conversation_id primitive.ObjectID) ([]types.ChatListItem, error) {
	var filter bson.M = bson.M{"conversation_id": conversation_id}
	cursor, err := store.mongo_client.Database("chat").Collection("chat_history").Find(context.TODO(), filter)
	var results []types.ChatListItem
	if err != nil {
		return results, err
	}
	if err := cursor.All(context.TODO(), &results); err != nil {
		return results, nil
	}
	return results, nil
}

func (store *chatStore) SendChatTextMsg(text string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID) {

}

func (store *chatStore) SendChatMediaMsg(link []string, sender_id primitive.ObjectID, receiver_id primitive.ObjectID) {
}
