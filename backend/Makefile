# Builds the application
build:
	go build -o main .

# Start up a development server with live-reload utility
start:
	$(shell go env GOPATH)/bin/air

# Generate types to be used on frontend
generate-types:
	rm -rf ../frontend/src/generated
	mkdir ../frontend/src/generated
	# Handle Enums
	echo "export enum Color {Turquoise = 'Turquoise', Blue = 'Blue', Cyan = 'Cyan', Green = 'Green', Yellow = 'Yellow', Red = 'Red'}" >> ../frontend/src/generated/types.ts 
	echo "export enum Role {Owner = 'Owner', Editor = 'Editor', Viewer = 'Viewer'}" >> ../frontend/src/generated/types.ts 
	touch ../frontend/src/generated/models.ts
	$(shell go env GOPATH)/bin/tscriptify \
		-package=github.com/EmilyOng/cvwo/backend/models \
		-target=../frontend/src/generated/models.ts \
		-import="import { Color } from './types'" \
		-import="import { Role } from './types'" \
		-interface \
		models/board.go \
		models/common.go \
		models/member.go \
		models/state.go \
		models/tag.go \
		models/task.go \
		models/user.go

# Deploy application to Heroku
push/heroku:
	heroku container:login
	heroku container:push web -a tusk-manager-backend
	heroku container:release web -a tusk-manager-backend
	