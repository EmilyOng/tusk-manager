FROM golang:1.17-alpine

WORKDIR /opt/app

COPY . /opt/app/

RUN apk --no-cache add curl make gcc  g++ git

RUN go mod download
RUN make build

CMD ["./main"]
