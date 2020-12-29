restart:
	go clean
	rm ./migrate
	go build github.com/can-z/pickup/server
	go build github.com/can-z/pickup/server/cmd/migrate
	./server
test:
	go clean
	go build
	go test
PHONY: restart test
