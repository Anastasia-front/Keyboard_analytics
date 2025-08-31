# Keyboard analytics

This project is a real-time keyboard analytics tool built with **Next.js** (frontend) and **NestJS** (backend).  
Users can see live statistics of key presses via WebSocket, with SEO-friendly server-rendered initial data.

---

## 🛠 Technologies

- [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [MobX](https://mobx.js.org/README.html)
- [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) + [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://docs.docker.com/) + [docker-compose](https://docs.docker.com/compose/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [GitHub Actions](#github-actions)
- [Deployment](#deployment)
  - [Deploy database on Supabase](#deploy-database-on-supabase)
  - [Deploy backend on Railway](#deploy-backend-on-railway)
  - [Deploy frontend on Vercel](#deploy-frontend-on-vercel)
---

## 📂 Project structure

```bash
/apps
  /client  (Next.js)
  /server  (NestJS)
.eslintrc
.gitignore
.prettierignore
docker-compose.yml
eslint.config.mjs
package.json
prettier.config.js
README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
# Install dependencies for all packages
npm install
# or
yarn install
```

### 2. Run PostgreSQL via Docker

- docker-compose up -d

### 3. Environment variables

Create in

```bash
/apps
  /server
    /.env
```

variables like :

```bash
# PostgreSQL connection settings
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=mydb

# NestJS app settings
PORT=4000
FRONT_BASE_URL=http://localhost:3000
```

Create in

```bash
/apps
  /client
    /.env
```

variables like :

```bash
NEXT_PUBLIC_FRONT_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BACK_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

### 4. Run Backend

```bash
cd apps/server
yarn run start:dev
```

### 5. Run Frontend

```bash
cd apps/client
yarn run dev
```

---

### 📊 Optimization strategy

To prevent database overload under heavy key press frequency:

- Store key press counts in memory.

- Batch write updates to DB every X seconds (configurable).

- Use transactions to minimize write operations.

---

### 📄 Additional features

- Static pages per key with ISR (Incremental Static Regeneration), updating every minute.

- SEO-friendly initial render for main statistics page.

- Navigation between keys based on press count.

## ⚙️ Project setup

### For client side of project use command inside <u>apps/</u> directory to initialize it:

1. Create a Next.js + TypeScript project

```bash
npx create-next-app@latest client --typescript
```

This creates a Next.js app with TypeScript support out of the box.

2. To install MobX

Project needs mobx for state management and mobx-react-lite for React bindings.

```bash
yarn add mobx mobx-react-lite recharts
```

3. Create a MobX store

In Next.js, it needs to think about SSR (Server-Side Rendering).

If create a store as a singleton, it can be shared between requests, which may cause data leaks between users.

The fix: create a function that returns a new store instance per request, but keep a singleton on the client.

```bash
/src
  /stores
    /statStore.ts
```

4. Integrate MobX with Next.js
   Create a small hook to initialize the store depending on whether we’re on the server or client.

```bash
/src
  /stores
    /index.ts
```

5. Add environment variables in .env

```bash
NEXT_PUBLIC_FRONT_BASE_URL
NEXT_PUBLIC_BACK_API_URL
NEXT_PUBLIC_WS_URL
```

6. Create WebSocket connection hook in

```bash
/src
  /hooks
    /useWebSocket.ts
```

7. Create home page with SSR & chart in

```bash
/src
  /app
    /page.tsx
```

8. Create static key pages (/key/[keyName]) in

```bash
/src
  /app
    /key
      /[keyName].tsx
```

### For server side of project use command inside <u>apps/</u> directory to initialize it (with yarn):

1. Create NestJS project

```bash
yarn global add @nestjs/cli
nest new server
```

2. Install PostgreSQL & TypeORM dependencies

```bash
yarn add @nestjs/typeorm typeorm pg
yarn add @nestjs/config
```

3. Add dependencies for WebSocket (NestJS does not ship @nestjs/websockets or socket.io by default)

```bash
yarn add @nestjs/websockets @nestjs/platform-socket.io socket.io
yarn add -D @types/socket.io
```

- @nestjs/websockets → WebSocket decorators (@WebSocketGateway, @SubscribeMessage, etc.)
- @nestjs/platform-socket.io → Socket.IO adapter for NestJS
- socket.io → actual WebSocket server library
- @types/socket.io → TypeScript types for Socket.IO

#### After installing

Your tsconfig.json should automatically pick up the types. If not, add line below under compilerOptions.

```bash
 "types": ["node", "socket.io"]
```

4. Configure environment variables in .env

```bash
# PostgreSQL connection settings
DB_HOST=
DB_PORT
DB_USER
DB_PASS
DB_NAME

# NestJS app settings
PORT
FRONT_BASE_URL
```

5. Create counter module

```bash
nest g module counter
nest g service counter --no-spec
nest g controller counter --no-spec
```

It must create next structure of folder:

```bash
/src
  /counter
    /counter.entity.ts
    /counter.module.ts
    /counter.service.ts
    /counter.controller.ts
```

5. Configure TypeORM in app.module.ts (connect module to app)

```bash
/src
  /app.module.ts
```

## GitHub Actions
   - Run tests, lint, build
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - DB is managed in Supabase


## Deployment
### Deploy database on Supabase
- Go to Supabase -> Register/Login -> Create a project
- Get variables to connect backend : click on Connect button on header -> select connection method

#### How to move DB from local Postgres to Supabase

1. Export your local DB with pg_dump in Docker (exec tab)
```bash
pg_dump -U local_user -h localhost -p 5432 local_db_name > dump.sql
```

2. Go to Supabase → Project → Settings → Database → Connection info (or Connect button in the header od the Project page):

- Scroll to Connection Pooling (Session Pooler / Transaction Pooler)

Use that connection string instead of the “Direct Connection” one.
* Direct connection caused the error:

```bash
psql: error: connection to server at "db.qedgqkfndvoswgmxnmqa.supabase.co" (2a05:d012:42e:570b:9105:c909:a8b6:9cd3), port 5432 failed: Network is unreachable
        Is the server running on that host and accepting TCP/IP connections?
```
3. Execute command like: 
```bash
psql 'postgresql://postgres.qedgqkfndvoswgmxnmqa:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:6543/postgres' < dump.sql
```
OR
it could be done by one complete command like:
```bash
pg_dump -U local_user -h localhost -p 5432 local_db_name | psql "postgresql://postgres.qedgqkfndvoswgmxnmqa:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:6543/postgres"
```

### Deploy backend on Railway
- Go to Railway -> Register/Login -> Create a project (chose gitHub repo and set /apps/server as root folder)
- Add env variables : click on project in dashboard -> go to Variables tab (there are 8 default service variables) -> add variables (DB_HOST
DB_PORT,
DB_USER,
DB_PASS,
DB_NAME,
FRONT_BASE_URL,
PORT)
- Generate domain : click on project in dashboard -> go to Settings tab -> Networking section -> Generate domain (you get like name_of_project-environment.up.railway.app)

### Deploy frontend on Vercel
- Go to Vercel -> Register/Login -> Create a project (chose gitHub repo and set /apps/client as root folder)
- Add env variables : click on project in dashboard -> go to Settings tab -> Environment Variables side menu -> add variables (NEXT_PUBLIC_BACK_API_URL, NEXT_PUBLIC_WS_URL)
- Get domain : go to Overview tab in dashboard -> copy Domain
