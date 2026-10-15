// Command palette serves the Fovea palette as JSON.
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

// Swatch is one named color in a variant.
type Swatch struct {
	Name string  `json:"name"`
	Hex  string  `json:"hex"`
	Lc   float64 `json:"lc"`
}

// Store looks up the swatches of a variant.
type Store interface {
	Variant(name string) ([]Swatch, error)
}

var ErrUnknownVariant = errors.New("unknown variant")

type memoryStore map[string][]Swatch

func (s memoryStore) Variant(name string) ([]Swatch, error) {
	swatches, ok := s[name]
	if !ok {
		return nil, fmt.Errorf("%w: %q", ErrUnknownVariant, name)
	}
	return swatches, nil
}

func handler(store Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		swatches, err := store.Variant(r.PathValue("variant"))
		switch {
		case errors.Is(err, ErrUnknownVariant):
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		case err != nil:
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(swatches); err != nil {
			log.Printf("encode: %v", err)
		}
	}
}

func main() {
	store := memoryStore{
		"day": {{Name: "bg", Hex: "#f9f5ec"}, {Name: "fg", Hex: "#2f2a25", Lc: 95.1}},
	}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /palette/{variant}", handler(store))
	addr := os.Getenv("ADDR")
	if addr == "" {
		addr = ":8080"
	}
	server := &http.Server{Addr: addr, Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	log.Fatal(server.ListenAndServe())
}
