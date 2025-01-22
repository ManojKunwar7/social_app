package auth

import (
	"fmt"
	"net/http"

	"github.com/ManojKunwar7/social_app/backend/helper"
	"github.com/ManojKunwar7/social_app/backend/types"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type Handler struct {
	auth_module types.AuthModuleInterface
}

func NewHandler(auth_module types.AuthModuleInterface) *Handler {
	return &Handler{
		auth_module: auth_module,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.LoginController).Methods(http.MethodPost)
	router.HandleFunc("/register", h.RegisterController).Methods(http.MethodPost)
}

func (h *Handler) LoginController(w http.ResponseWriter, r *http.Request) {
	// TODO write Router
	var payload types.UserLoginPayload
	if err := helper.ParseJson(r, &payload); err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	// ! Payload Validation is required
	fmt.Println("Your Payload :-", payload)
	if err := helper.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", error))
		return
	}
	resp := h.auth_module.LoginModule(payload)
	fmt.Println("Your Resp :-", resp)
	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{payload}})
}

func (h *Handler) RegisterController(w http.ResponseWriter, r *http.Request) {
	// TODO write Router
	var payload types.UserRegisterPayload
	if err := helper.ParseJson(r, &payload); err != nil {
		helper.WriteError(w, http.StatusBadRequest, err)
		return
	}
	fmt.Println("Your Payload :-", payload)
	// ! Validation Check
	if err := helper.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", error))
		return
	}
	resp := h.auth_module.RegisterModule(payload)
	fmt.Println("Your resp ", resp)
	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": []any{payload}})
}
