restart:
	go clean
	rm ./migrate
	go build github.com/can-z/pickup/server
	go build github.com/can-z/pickup/server/cmd/migrate
	./server

PHONY: restart
