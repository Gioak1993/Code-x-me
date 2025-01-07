# Stage 1: Build the Go application
FROM --platform=$BUILDPLATFORM golang:1.23 AS builder

# Predefined build arguments for cross-compilation
ARG TARGETOS
ARG TARGETARCH

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to leverage Docker cache
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download && go mod verify

# Copy the entire project source code
COPY . .

# Build the Go application for the target platform
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -o main

# Stage 2: Create a minimal Docker image with the compiled binary
FROM alpine:latest

# Set the working directory in the final image
WORKDIR /app

# Install certificates (optional, if your app requires HTTPS)
RUN apk add --no-cache ca-certificates

# Copy the compiled binary from the builder stage
COPY --from=builder /app/main .

# Expose the backend port (adjust if different)
EXPOSE 8080

# Command to run the application
CMD ["./main"]
