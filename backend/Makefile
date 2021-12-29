docker/build-image:
	docker build -t cvwo-backend .

docker/run-image:
	docker run -d -p 5000:5000 cvwo-backend

build:
	go build -o main .

start:
	$(shell go env GOPATH)/bin/air

push/heroku:
	heroku container:login
	heroku container:push web -a tusk-manager-backend
	heroku container:release web -a tusk-manager-backend
	