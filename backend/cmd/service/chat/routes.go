package chat

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ManojKunwar7/social_app/backend/helper"
	"github.com/ManojKunwar7/social_app/backend/types"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	router.HandleFunc("/send/chat/text", h.SendChatTextController).Methods(http.MethodPost)
	router.HandleFunc("/send/chat/media", h.SendChatMediaController).Methods(http.MethodPost)
	router.HandleFunc("/fetch/previous-chat", h.FetchPreviousChatController).Methods(http.MethodPost)
	router.HandleFunc("/fetch/conversation-history", h.FetchConversationHistoryController).Methods(http.MethodPost)
}

func (h *Handler) FetchConversationHistoryController(w http.ResponseWriter, r *http.Request) {
	var payload types.ConversationHistoryPayload
	if err := helper.ParseJson(r, &payload); err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	fmt.Println("Your Payload :-", payload)
	if err := helper.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", error))
		return
	}
	results, err := h.chat_module.GetConversationHistory(payload.UserID)

	if err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": results})
}

func (h *Handler) FetchPreviousChatController(w http.ResponseWriter, r *http.Request) {
	var payload types.ChatHistoryPayload
	if err := helper.ParseJson(r, &payload); err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	fmt.Println("Your Payload :-", payload)
	if err := helper.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", error))
		return
	}
	results, err := h.chat_module.GetPreviousChat(payload.ConversationID)

	if err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": results})
}

func (h *Handler) SendChatTextController(w http.ResponseWriter, r *http.Request) {
	var payload types.SendTextChatPayload
	if err := helper.ParseJson(r, &payload); err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	fmt.Println("Your Payload :-", payload)
	if err := helper.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", error))
		return
	}
	// ! Can Use Cookies
	var userObj types.UserProfile
	var receiverObj types.UserProfile
	// ! Get Profiles

	if !payload.ConversationID.IsZero() {
		// ! Check Conversation Id
		conversation, err := h.chat_module.GetConversationHistoryByID(payload.ConversationID)
		fmt.Println("conversatrion -->", conversation)
		if err != nil {
			fmt.Println("Check Conversation err -->", err)
			helper.WriteJson(w, http.StatusOK, map[string]any{"status": false, "data": []any{}})
			return
		}
		if len(conversation) <= 0 {
			fmt.Println("Check Conversation err -->", err)
			helper.WriteJson(w, http.StatusOK, map[string]any{"status": false, "data": []any{}})
			return
		}
	} else {
		// ! Create Conversation Id
		conversation_obj := types.ConversationHistory{
			Msg:          payload.Msg,
			SenderId:     payload.SenderId,
			SenderName:   userObj.First_Name + " " + userObj.Last_Name,
			ReceiverId:   payload.ReceiverId,
			ReceiverName: receiverObj.First_Name + " " + receiverObj.Last_Name,
			CreatorId:    payload.SenderId,
			LastMsgByID:  payload.SenderId,
			MsgTimestamp: primitive.NewDateTimeFromTime(time.Now()),
			CreatedAt:    primitive.NewDateTimeFromTime(time.Now()),
		}
		resp, err := h.chat_module.CreateConversationHistory(conversation_obj)
		fmt.Println("resp -->", resp)

		if err != nil {
			fmt.Println("Create Conversation err -->", err)
			helper.WriteJson(w, http.StatusOK, map[string]any{"status": false, "data": []any{}})
			return
		}
	}

	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{}})
}

func (h *Handler) SendChatMediaController(w http.ResponseWriter, r *http.Request) {

	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{}})
}
