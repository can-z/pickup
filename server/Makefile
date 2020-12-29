buildall: migrate server
	go clean
	rm ./migrate
	go build github.com/can-z/pickup/server
	go build github.com/can-z/pickup/server/cmd/migrate
restart: buildall
	./server
test:
	go clean
	go build
	go test
resetdb:
	rm local.db
	./migrate

.PHONY: test resetdb restart buildall
