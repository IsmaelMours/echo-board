# EchoBoard

EchoBoard is a real-time communication platform designed to facilitate seamless interaction between users. It aims to provide a robust and scalable solution for various communication needs, including messaging, notifications, and collaborative features.

## Project Structure

The project is organized into the following main directories:

-   `client/`: Contains the frontend application code.
-   `server/`: Contains the backend API and business logic.
-   `worker/`: Contains background processing and task management services.
-   `infra/`: Contains infrastructure-as-code (IaC) definitions for deploying the application.
-   `.github/`: Contains GitHub Actions workflows for CI/CD.

## Getting Started

## Getting Started

To get started with EchoBoard, follow these steps:

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Docker and Docker Compose

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/echoboard.git
    cd echoboard
    ```

2.  **Install dependencies for all workspaces:**

    ```bash
    npm run install:all
    ```

### Environment Variables

Create a `.env` file in the root directory of the project based on the `.env.example` file:

```bash
cp .env.example .env
```

Edit the `.env` file and fill in the required values, especially `JWT_SECRET`, `MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, `VITE_API_URL`, and `RESEND_API_KEY`.

### Running the Application (Development)

Use Docker Compose to run all services (client, server, worker, MongoDB, Redis):

```bash
npm run start:dev
```

This will:
- Build Docker images for the client, server, and worker.
- Start MongoDB and Redis containers.
- Start the Express server (accessible at `http://localhost:3000`).
- Start the BullMQ worker.
- Start the Vite client (accessible at `http://localhost:5173`).

To stop the development environment:

```bash
npm run stop:dev
```

### Building Individual Components

You can build individual components using the following scripts:

- **Build Server:**

    ```bash
    npm run build:server
    ```

- **Build Worker:**

    ```bash
    npm run build:worker
    ```

- **Build Client:**

    ```bash
    npm run build:client
    ```

## Tech Stack

### Frontend (`client/`)

- **Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Language:** TypeScript

### Backend (`server/`)

- **Framework:** Express.js
- **Database ORM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Logging:** Pino
- **Rate Limiting:** Express-rate-limit
- **Language:** TypeScript

### Worker (`worker/`)

- **Job Queue:** BullMQ
- **Message Broker:** Redis
- **Language:** TypeScript

### Infrastructure (`infra/`)

- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Database:** MongoDB
- **Cache/Message Broker:** Redis

## API Endpoints

### Health Check
- `GET /api/health` - Returns service health status, database connectivity, and system metrics

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login
- `POST /api/users/signout` - User logout
- `GET /api/users/currentuser` - Get current user info

### Feedback Management
- `POST /api/feedback` - Create new feedback (authenticated users)
- `GET /api/feedback/:id` - Get specific feedback by ID
- `GET /api/feedback` - List all feedback (admin only)
- `PUT /api/feedback/:id` - Update feedback (admin only)
- `DELETE /api/feedback/:id` - Delete feedback (admin only)

## Deployment

The application is deployed using Kubernetes with the following components:
- **Client**: React frontend served on port 8080
- **Server**: Express.js API on port 3000
- **Worker**: Background job processor
- **Database**: MongoDB
- **Cache**: Redis for job queues
- **Ingress**: NGINX ingress controller for public access

### Live Deployment
- **URL**: https://echoboard.dev
- **Health Check**: https://echoboard.dev/api/health