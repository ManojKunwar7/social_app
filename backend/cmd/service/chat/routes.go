package chat

import (
	"net/http"

	"github.com/ManojKunwar7/social_app/backend/helper"
	"github.com/ManojKunwar7/social_app/backend/types"
	"github.com/gorilla/mux"
)

type Handler struct {
	chat_module types.ChatModuleInterface
}

func NewHandler(chat_module types.ChatModuleInterface) *Handler {
	return &Handler{
		chat_module: chat_module,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/fetch/conversation-history", h.FetchConversationHistoryController).Methods(http.MethodPost)
	router.HandleFunc("/fetch/previous-chat", h.FetchPreviousChatController).Methods(http.MethodPost)
	router.HandleFunc("/send/chat/text", h.SendChatTextController).Methods(http.MethodPost)
	router.HandleFunc("/send/chat/media", h.SendChatMediaController).Methods(http.MethodPost)
}

func (h *Handler) FetchConversationHistoryController(w http.ResponseWriter, r *http.Request) {

	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{}})
}

func (h *Handler) FetchPreviousChatController(w http.ResponseWriter, r *http.Request) {

	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{}})
}

func (h *Handler) SendChatTextController(w http.ResponseWriter, r *http.Request) {

	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{}})
}

func (h *Handler) SendChatMediaController(w http.ResponseWriter, r *http.Request) {

	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{}})
}
