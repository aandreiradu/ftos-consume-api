<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Simple API to consume in the training sessions

## ℹ️ Prerequisites

- [Docker](https://docs.docker.com/engine/install/)

Before running the app, make sure you create a .env file. As an example, you can use the .env.example file or running the following command in your terminal

```bash

$ cp .env.example .env

```

## 🚀 Running the app

```bash

$ docker compose up -d

```

```bash

$ pnpm start:dev

```

## 🧾 Documentation / Swagger

```
http://localhost:3000/documentation
```

## ℹ️ Available routes

```bash

POST /auth/sign-up - create account

POST /auth/sign-in - authentication

```
