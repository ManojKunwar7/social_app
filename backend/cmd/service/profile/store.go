package profile

import (
	"context"

	"github.com/ManojKunwar7/social_app/backend/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProfileStore struct {
	mongo_client *mongo.Client
}

func NewStore(mongo_client *mongo.Client) *ProfileStore {
	return &ProfileStore{
		mongo_client: mongo_client,
	}
}

func (store *ProfileStore) SearchProfileByQuery(query string) ([]types.UserProfile, error) {
	var filter bson.M = bson.M{"$or": []any{
		bson.M{
			"email": bson.M{"$regex": query, "$options": "si"},
		},
		bson.M{
			"user_name": bson.M{"$regex": query, "$options": "si"},
		},
		bson.M{
			"first_name": bson.M{"$regex": query, "$options": "si"},
		},
		bson.M{
			"last_name": bson.M{"$regex": query, "$options": "si"},
		},
	}}
	cursor, err := store.mongo_client.Database("users").Collection("profile").Find(context.TODO(), filter)
	var results []types.UserProfile
	if err != nil {
		return results, nil
	}
	if err := cursor.All(context.TODO(), &results); err != nil {
		return results, nil
	}
	return results, nil
}
