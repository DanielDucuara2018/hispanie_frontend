# 🌐 Hispanie Frontend

The **Hispanie Frontend** is a modern, responsive web application built with **React**. It serves as the user interface for the Hispanie platform, providing users with an intuitive and seamless experience. Designed with scalability and performance in mind, this frontend integrates seamlessly with the [Hispanie Backend](https://github.com/DanielDucuara2018/hispanie_backend) to deliver dynamic content and functionalities.

---

## 🚀 Features

- **Responsive Design**: Ensures optimal viewing across various devices.
- **Modular Architecture**: Facilitates maintainability and scalability.
- **Dockerized Development Environment**: Simplifies setup and deployment processes.
- **Integration with Backend API**: Communicates efficiently with the Hispanie Backend for data retrieval and manipulation.
- **Utilizes Create React App**: Leverages the robust tooling and configurations provided by Create React App.([GitHub][1])

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or above)
- **npm** (v6 or above)
- **Docker** (for containerized development)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/DanielDucuara2018/hispanie_frontend.git
   cd hispanie_frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🐳 Dockerized Development

For a containerized development environment:

1. **Build and Start Containers**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build app_dev
   ```

2. **Access the Application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode.
- **`npm test`**: Launches the test runner in interactive watch mode.
- **`npm run build`**: Builds the app for production to the `build` folder.
- **`npm run eject`**: Removes the single build dependency from your project. **Note: This is a one-way operation.**([GitHub][1])

---

## 📁 Project Structure

```bash
hispanie_frontend/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API calls and services
│   └── App.js          # Main application component
├── Dockerfile.dev      # Docker configuration for development
├── docker-compose.dev.yml # Docker Compose configuration
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## Build docker image for production

# Hispanie Frontend

A modern React-based frontend application for the Hispanie platform, connecting people with cultural events and businesses.

## Features

- 🎭 Event discovery and management (concerts, theaters, expositions, etc.)
- 🏪 Business directory (artists, restaurants, cafes, boutiques)
- 🗺️ Interactive maps with Leaflet integration
- 🔐 User authentication and profiles
- 📱 Responsive design with React Bootstrap
- 🎨 Modern UI with gradient designs and animations
- 🌐 Multi-language support ready
- ⚡ Redux state management with persistence

## Tech Stack

- **React** 18.3.1 - UI framework
- **Redux** 5.0.1 - State management
- **React Router** 6.28.0 - Navigation
- **React Bootstrap** 2.10.5 - UI components
- **Leaflet** 4.2.1 - Interactive maps
- **Axios** - HTTP client
- **Node** 22 - Runtime (Alpine-based Docker)

## Quick Start

### Development with Docker (Recommended)

The easiest way to start development with SSL and proper domain setup:

```bash
# One-command setup with SSL certificates and local domains
./scripts/start-dev.sh
```

This will:

- Generate SSL certificates automatically
- Set up local domains (hispanie.local, api.hispanie.local)
- Start Docker containers with nginx reverse proxy
- Enable React hot reload

**Access:**

- Frontend: https://hispanie.local
- API: https://api.hispanie.local

**Stop:**

```bash
docker-compose down
```

### Manual Docker Setup

If you prefer manual control:

```bash
# Start development environment
docker-compose up -d --build

# Access at http://localhost:3202
```

### Local Development (No Docker)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Access at http://localhost:3202
```

## Environment Configuration

Copy the environment template and configure:

```bash
cp .env.template .env
```

**Key variables:**

- `REACT_APP_HISPANIE_API_URL` - Backend API URL
- `REACT_APP_ENABLE_REDUX_DEVTOOLS` - Enable Redux DevTools
- `WDS_SOCKET_HOST` - Webpack dev server host
- `WDS_SOCKET_PORT` - Webpack dev server port

See `.env.template` for full documentation.

## Project Structure

```
hispanie/
├── src/
│   ├── components/          # React components
│   │   ├── agenda/         # Event-related components
│   │   ├── discover/       # Business directory components
│   │   ├── login/          # Authentication components
│   │   └── map/            # Map visualization
│   ├── actions/            # Redux actions
│   ├── reducers/           # Redux reducers
│   ├── App.js              # Main application component
│   ├── Store.js            # Redux store configuration
│   └── Api.js              # API client
├── nginx/                  # Nginx configurations
│   ├── nginx-dev.conf      # Development with SSL
│   └── nginx-prod.conf     # Production static serving
├── scripts/                # Deployment scripts
│   ├── start-dev.sh        # Development environment setup
│   └── deploy-cloud.sh     # Cloud deployment
├── public/                 # Static assets
├── Dockerfile              # Multi-stage Docker build
├── Dockerfile.cloud        # Cloud-optimized build
└── docker-compose.yml      # Development orchestration
```

## Available Scripts

### Development

```bash
npm start           # Start development server (port 3202)
npm test           # Run test suite
npm run build      # Build for production
```

### Deployment

```bash
# Deploy to Google Cloud Storage
./scripts/deploy-cloud.sh -p YOUR_PROJECT_ID

# Deploy with manual bucket
./scripts/deploy-cloud.sh -b hispanie-frontend-bucket

# See all options
./scripts/deploy-cloud.sh --help
```

## Cloud Deployment

### Google Cloud Storage + CDN

1. **Build and deploy:**

   ```bash
   ./scripts/deploy-cloud.sh -p your-gcp-project-id
   ```

2. **Configure Cloudflare Worker** (optional, for custom domain):
   - Upload `cloudflare-worker.js` to Cloudflare Workers
   - Set environment variable: `BUCKET_NAME=hispanie-frontend`
   - Configure worker route to match your domain

### Docker Production Image

```bash
# Build production image
docker build -t hispanie-app:latest .

# Tag for registry
docker tag hispanie-app europe-west4-docker.pkg.dev/hispanie/hispanie-docker/hispanie-app:0.1

# Push to registry
docker push europe-west4-docker.pkg.dev/hispanie/hispanie-docker/hispanie-app:0.1
```

## Development Workflow

1. **Start environment:**

   ```bash
   ./scripts/start-dev.sh
   ```

2. **Make changes** - React hot reload updates automatically

3. **Test your changes:**

   ```bash
   npm test
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Deploy:**
   ```bash
   ./scripts/deploy-cloud.sh -p your-project
   ```

## Troubleshooting

### SSL Certificate Issues

```bash
# Regenerate certificates
rm -rf nginx/ssl/*
./scripts/start-dev.sh
```

### Docker Network Issues

```bash
# Ensure backend network exists
cd ../hispanie_backend
docker-compose up -d
cd ../hispanie
docker-compose up -d
```

### Port Conflicts

```bash
# Check what's using port 3202
lsof -i :3202

# Stop existing containers
docker-compose down
```

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clean Docker build
docker-compose down -v
docker-compose up -d --build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `./scripts/start-dev.sh`
4. Build production: `npm run build`
5. Submit a pull request

## License

Proprietary - Hispanie Platform

## Support

For issues and questions, contact the development team.
