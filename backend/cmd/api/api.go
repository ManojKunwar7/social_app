package api

import (
	"log"
	"net/http"

	"github.com/ManojKunwar7/social_app/backend/cmd/service/auth"
	"github.com/ManojKunwar7/social_app/backend/cmd/service/chat"
	"github.com/ManojKunwar7/social_app/backend/cmd/service/profile"
	wsserver "github.com/ManojKunwar7/social_app/backend/cmd/ws-server"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
)

type ApiServer struct {
	addr           string
	mongodb_client *mongo.Client
	redis_client   *redis.Client
}

func NewAPIServer(addr string, mongodb_client *mongo.Client, redis_client *redis.Client) *ApiServer {
	return &ApiServer{
		addr:           addr,
		mongodb_client: mongodb_client,
		redis_client:   redis_client,
	}
}

func (s *ApiServer) Run() error {
	router := mux.NewRouter()
	subRouter := router.PathPrefix("/api/v1").Subrouter()

	// ! --- Ws Connection
	pool := wsserver.NewPool()
	go pool.Start()
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wsserver.WebsocketConnHandler(pool, w, r)
	})

	// ! Auth Router
	authStore := auth.NewStore(s.mongodb_client, s.redis_client)
	authRouter := auth.NewHandler(authStore, s.redis_client)
	authRouter.RegisterRoutes(subRouter)

	// ! Protected Route
	protectedRouter := router.PathPrefix("/api/private/v1").Subrouter()
	// protectedRouter.Use()

	// ! Chat Router
	chatStore := chat.NewStore(s.mongodb_client)
	chatRouter := chat.NewHandler(chatStore)
	chatRouter.RegisterRoutes(protectedRouter)

	// ! Profile Routes
	profileStore := profile.NewStore(s.mongodb_client)
	profileRouter := profile.NewHandler(profileStore)
	profileRouter.RegisterRoutes(protectedRouter)

	log.Println("Server listening on", s.addr)
	return http.ListenAndServe(s.addr, router)
}
