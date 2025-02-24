package profile

import (
	"log"
	"net/http"
	"strings"

	"github.com/ManojKunwar7/social_app/backend/helper"
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
	query := r.URL.RawQuery
	log.Println("Query", query)
	var name string
	for _, s := range strings.Split(query, "&") {
		s := strings.Split(s, "=")
		if strings.Trim(s[0], " ") == "query" {
			name = strings.Trim(s[1], " ")
		}
	}
	if len(name) <= 0 {
		helper.WriteJson(w, http.StatusOK, map[string]any{"status": false, "data": []any{}})
		return
	}
	// ! Get Profile
	resp, err := h.profile_module.SearchProfileByQuery(name)
	if err != nil {
		helper.WriteJson(w, http.StatusOK, map[string]any{"status": false, "data": []any{}})
		return
	}
	if len(resp) <= 0 {
		helper.WriteJson(w, http.StatusOK, map[string]any{"status": false, "data": []any{}})
		return
	}
	helper.WriteJson(w, http.StatusOK, map[string]any{"status": true, "data": resp})
}
