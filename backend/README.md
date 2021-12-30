# backend

## Getting Started

The application uses [cosmtrek/air](https://github.com/cosmtrek/air) to provide live reload utility.

- Start the application: `make start`
- Deploy to Heroku: `make push/heroku`
  - The deployment builds a Docker image and pushes to Heroku. More details on the Docker image at [Dockerfile](/backend/Dockerfile)

Sample data is seeded upon sign up. Details are at [models/seed.go](models/seed.go).

### Setting up your environment
- (in `.env`) `AUTH_SECRET_KEY`: Requires any string
