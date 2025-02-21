package wsserver

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Accepting all requests
	},
}

func WSconnReader(ws *websocket.Conn) {
	for {
		messageType, incMsg, err := ws.ReadMessage()
		if err != nil {
			log.Fatalln(err)
			return
		}

		log.Println("INcoming message---> ", string(incMsg))

		if err := ws.WriteMessage(messageType, []byte("Hello from server")); err != nil {
			log.Println("Write message error", err)
			return
		}
	}
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalf("WS ERRO:-  %s\n", err)
		return nil, err
	}
	log.Println("Client successfully connected!", ws)

	return ws, nil
}

func WebsocketConnHandler(pool *Pool, w http.ResponseWriter, r *http.Request) {
	ws, err := Upgrade(w, r)
	if err != nil {
		log.Fatalf("WS ERRO:-  %s\n", err)
	}

	client := &Client{
		Conn: ws,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
	// WSconnReader(ws)
}
