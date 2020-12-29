buildall:
	go clean
	rm -f ./migrate
	go build github.com/can-z/pickup/server
	go build github.com/can-z/pickup/server/cmd/migrate
restart: buildall
	./server
test:
	go clean
	go build
	go test
resetdb:
	rm -f local.db
	./migrate

.PHONY: test resetdb restart buildall
