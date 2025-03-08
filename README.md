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

```bash
docker build -t hispanie-app:latest .
docker tag hispanie-app europe-west4-docker.pkg.dev/hispanie/hispanie-docker/hispanie-app:0.1
```

## Push docker production image

```bash
docker push europe-west4-docker.pkg.dev/hispanie/hispanie-docker/hispanie-app:0.1
```
