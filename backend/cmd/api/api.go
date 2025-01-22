package api

import (
	"log"
	"net/http"

	"github.com/ManojKunwar7/social_app/backend/cmd/service/auth"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

type ApiServer struct {
	addr           string
	mongodb_client *mongo.Client
}

func NewAPIServer(addr string, mongodb_client *mongo.Client) *ApiServer {
	return &ApiServer{
		addr:           addr,
		mongodb_client: mongodb_client,
	}
}

func (s *ApiServer) Run() error {
	router := mux.NewRouter()
	subRouter := router.PathPrefix("/api/v1").Subrouter()

	authStore := auth.NewStore(s.mongodb_client)
	authRouter := auth.NewHandler(authStore)
	authRouter.RegisterRoutes(subRouter)

	log.Println("Server listening on", s.addr)
	return http.ListenAndServe(s.addr, router)
}
