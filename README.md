# Hispanie front-end app

## Setup Environnement 

```bash
docker-compose -f docker-compose.dev.yml up -d --build app_dev
```

## Build docker image for production

```bash
docker build -t hispanie-app:latest .
docker tag hispanie-app europe-west4-docker.pkg.dev/hispanie/hispanie-docker/hispanie-app:0.1
```

## Push docker production image

```bash
docker push europe-west4-docker.pkg.dev/hispanie/hispanie-docker/hispanie-app:0.1
```
