package auth

import (
	"fmt"
	"net/http"

	"github.com/ManojKunwar7/social_app/backend/helper"
	"github.com/ManojKunwar7/social_app/backend/types"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
)

type Handler struct {
	auth_module  types.AuthModuleInterface
	redis_client *redis.Client
}

func NewHandler(auth_module types.AuthModuleInterface, redis_client *redis.Client) *Handler {
	return &Handler{
		auth_module:  auth_module,
		redis_client: redis_client,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.LoginController).Methods(http.MethodPost)
	router.HandleFunc("/register", h.RegisterController).Methods(http.MethodPost)
	router.HandleFunc("/check/token", h.CheckTokenController).Methods(http.MethodPost)
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
	user_profile := types.UserProfile{}
	resp := h.auth_module.LoginModule(payload, &user_profile)
	fmt.Println("Your Resp :-", resp)
	fmt.Println("user_profile :-", user_profile)
	if resp.Status {
		sessionId, err := helper.CreateAuthSession(*h.redis_client, user_profile)
		if err != nil {
			helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", err.Error()))
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:  "sessionId",
			Value: sessionId,
		})
		helper.WriteJson(w, http.StatusOK, resp)
		return
	}
	helper.WriteJson(w, http.StatusOK, resp)
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

	if payload.Password != payload.ConfirmPassword {
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("password and confirm password are not same"))
		return
	}

	user, err := h.auth_module.FindUserByEmail(payload.Email)
	fmt.Printf("%q\n", user)
	if err != nil || len(user) > 0 {
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("Account with this email already exists!"))
		return
	}
	hashedPassword, err := helper.ConvertPaswordToHashPassword(payload.Password)
	if err != nil {
		helper.WriteError(w, http.StatusBadRequest, fmt.Errorf("password and confirm password are not same"))
		return
	}
	payload.Password = hashedPassword
	fmt.Printf("Hashed password %q\n", hashedPassword)
	resp := h.auth_module.RegisterModule(payload)
	fmt.Println("Your resp ", resp)
	helper.WriteJson(w, http.StatusOK, resp)
}

func (h *Handler) CheckTokenController(w http.ResponseWriter, r *http.Request) {
	var payload types.TokenPayload
	if err := helper.ParseJson(r, &payload); err != nil {
		helper.WriteJson(w, http.StatusBadRequest, map[string]any{
			"status": false, "authenticated": false, "data": []any{}, "c_msg": err.Error(), "alert_status": "error",
		})
		return
	}
	resp, err := h.auth_module.CheckToken(payload.SessionID)
	if err != nil {
		helper.WriteJson(w, http.StatusBadRequest, map[string]any{
			"status": false, "authenticated": false, "data": []any{}, "c_msg": err.Error(), "alert_status": "error",
		})
		return
	}
	helper.WriteJson(w, http.StatusOK, map[string]any{
		"status": true, "authenticated": true, "data": []any{resp}, "c_msg": "User logged in!", "alert_status": "success",
	})
}
