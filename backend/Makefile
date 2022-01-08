docker/build-image:
	docker build -t cvwo-backend .

docker/run-image:
	docker run -d -p 5000:5000 cvwo-backend

build:
	go build -o main .

start:
	$(shell go env GOPATH)/bin/air

generate-types:
	rm -rf ../frontend/src/generated
	mkdir ../frontend/src/generated
	echo "export enum Color {Turquoise = 'Turquoise', Blue = 'Blue', Cyan = 'Cyan', Green = 'Green', Yellow = 'Yellow', Red = 'Red'}" > ../frontend/src/generated/types.ts 
	touch ../frontend/src/generated/models.ts
	$(shell go env GOPATH)/bin/tscriptify \
		-package=github.com/EmilyOng/cvwo/backend/models \
		-target=../frontend/src/generated/models.ts \
		-import="import { Color } from './types'" \
		-interface \
		models/board.go \
		models/common.go \
		models/state.go \
		models/tag.go \
		models/task.go \
		models/user.go

push/heroku:
	heroku container:login
	heroku container:push web -a tusk-manager-backend
	heroku container:release web -a tusk-manager-backend
	