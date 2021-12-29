FROM golang:1.17-alpine

WORKDIR /opt/app

COPY . /opt/app/

RUN apk --no-cache add curl make gcc  g++ git

RUN go mod download
# https://github.com/cosmtrek/air
# RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin
RUN make build

# EXPOSE 5000

# CMD ["make", "start"]
CMD ["./main"]
