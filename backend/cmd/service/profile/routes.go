package profile

import (
	"net/http"

	"github.com/ManojKunwar7/social_app/backend/types"
	"github.com/gorilla/mux"
)

type Handler struct {
	profile_module types.ProfileModuleInterface
}

func NewHandler(profile_module types.ProfileModuleInterface) *Handler {
	return &Handler{
		profile_module: profile_module,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/query/profile", h.QueryProfileController).Methods(http.MethodGet)
}

func (h *Handler) QueryProfileController(w http.ResponseWriter, r *http.Request) {

}
