package profile

import (
	"github.com/ManojKunwar7/social_app/backend/types"
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

	return nil, nil
}
