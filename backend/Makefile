docker/build-image:
	docker build -t cvwo-backend .

docker/run-image:
	docker run -d -p 5000:5000 cvwo-backend

build:
	go build -o main .

start:
	$(shell go env GOPATH)/bin/air
