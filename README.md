# Keyboard analytics

This project is a real-time keyboard analytics tool built with **Next.js** (frontend) and **NestJS** (backend).  
Users can see live statistics of key presses via WebSocket, with SEO-friendly server-rendered initial data.


## Navigation
- [Technologies](#🛠-technologies)
- [Features](#✨-features)
- [Optimization strategy](#📊-optimization-strategy)
- [Additional features](#📄-additional-features)
- [Getting started](#🚀-getting-started)
- [Project structure](#📂-project-structure)
- [Project setup](#⚙️-project-setup)
  - [For client side](#for-client-side-of-the-project)
  - [For server side](#for-server-side-of-the-project)
- [GitHub Actions](#github-actions)
- [Deployment](#deployment)
  - [Deploy database on Supabase](#deploy-database-on-supabase)
  - [Deploy backend on Railway](#deploy-backend-on-railway)
  - [Deploy frontend on Vercel](#deploy-frontend-on-vercel)
- [OAuth authentication](#oauth-authentication)
  - [Add env variables in /apps/server/.env](#add-env-variables-in-appsserverenv)
    - [JWT / Cookies](#🔐-JWT/cookies)
    - [Google OAuth](#🌐-google-oauth)
    - [GitHub OAuth](#🐙-github-oauth)
    - [LinkedIn OAuth](#💼-linkedin-oauth)
  - [Install necessary dependencies](#install-necessary-dependencies-in-root-folder)




## 🛠 Technologies

- [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [MobX](https://mobx.js.org/README.html)
- [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) + [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://docs.docker.com/) + [docker-compose](https://docs.docker.com/compose/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## ✨ Features

- **Real-time keyboard analytics**  
  The application listens to all key presses and streams them to the server over WebSocket. The statistics are updated live for all connected clients.

- **Persistent data storage**  
  All key press events are saved to a PostgreSQL database. The backend (NestJS + TypeORM) handles storing and broadcasting the aggregated stats.

- **Optimized database interaction**  
  Implemented efficient data handling to reduce load on the DB when keys are pressed frequently.

- **Interactive visualization**  
  The homepage shows a horizontal bar chart with the count of key presses for each key.  
  Additionally, statistics are broken down by type of key:  
  - **Number**  
  - **Letter**  
  - **CapsLock**  
  - **Special characters**

- **SEO-friendly statistics**  
  Initial stats are pre-rendered on the server to make them visible for crawlers.

- **Key detail pages**  
  Each unique key has its own statically generated page (`/key/[id]`) showing:  
  - The key name  
  - Total presses  
  - Navigation to keys with higher/lower press counts  
  Pages are refreshed every 1 minute for up-to-date info.

- **MobX state management with loading state**  
  While the store is being initialized, a loader is displayed, ensuring a smooth user experience.

- **Data cleanup**  
  Added functionality to **delete a key** from the database when needed.



### 📊 Optimization strategy
---


To prevent database overload under heavy key press frequency:

- Store key press counts in memory.

- Batch write updates to DB every X seconds (configurable).

- Use transactions to minimize write operations.


### 📄 Additional features
---

- Static pages per key with ISR (Incremental Static Regeneration), updating every minute.

- SEO-friendly initial render for main statistics page.

- Navigation between keys based on press count.


## 🚀 Getting started

### 1. Install dependencies

```bash
# Install dependencies for all packages
npm install
# or
yarn install
```

### 2. Environment variables

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

### 3. Run Backend

```bash
cd apps/server
yarn run start:dev
```

### 4. Run Frontend

```bash
cd apps/client
yarn run dev
```

### 5. Run Database
#### 🐳 Locally in Docker

1. Prerequisites

Make sure you have installed:

```bash
docker --version
docker compose version
```

If not, install Docker Desktop (it includes Docker Compose).

If docker-compose.yml doesn’t exist at the root yet, you can create one (example below).

```bash
version: "3.8"

services:
  postgres:
    image: postgres:15
    restart: always
    container_name: prog-genius-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
  ```
Now you need to launch Docker Desktop and run container by command:
```bash
docker compose up -d
```

#### 🔄 Connect to Supabase instead of local DB

If you want to use Supabase instead of Docker PostgreSQL:

- Stop the local DB container:
```bash
docker compose stop db
```

- Update your backend .env (/apps/server/.env) like this:
```bash
DB_HOST=aws-1-eu-west-3.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.qedgqkfndvoswgmxnmqa
DB_PASS=your_supabase_password
DB_NAME=postgres
```

- Restart only backend & frontend


Everything else (Supabase URL + anon key) stays in /apps/client/.env.

### 6. Launch all containers (optional, instead of steps 3-5)

Current version of the project include docker-compose.yml for this configuration.

Run from the root folder:

```bash
docker compose up --build
#after
docker compose up -d
```

Then visit:

- Frontend → http://localhost:3000
- Backend → http://localhost:4000
- PostgreSQL → exposed on port 5432 (you can connect via TablePlus / pgAdmin)

#### 🧩 Useful commands

| Action | Command |
|--------|----------|
| Start containers | `docker compose up -d` |
| Stop containers | `docker compose down` |
| View logs | `docker compose logs -f` |
| Rebuild after code changes | `docker compose up --build` |
| Enter backend shell | `docker exec -it keyboard-server sh` |
| Enter DB shell | `docker exec -it keyboard-db psql -U postgres -d mydb` |

#### 🌍 Host visibility

If you want to access your backend from your host (not just inside Docker), you already expose ports:

- 4000 → backend
- 3000 → frontend

So your local browser can reach both directly via localhost.

If another device on your network should access it, use your host machine IP, e.g.:

```bash
NEXT_PUBLIC_BACK_API_URL=http://192.168.0.10:4000
NEXT_PUBLIC_WS_URL=ws://192.168.0.10:4000
```

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

## ⚙️ Project setup
---

### For client side of the project 
---


**Use command inside <u>apps/</u> directory to initialize it:**

1. Create a Next.js + TypeScript project

```bash
npx create-next-app@latest client --typescript
```

This creates a Next.js app with TypeScript support out of the box.

2. To install MobX

Project needs mobx for state management and mobx-react-lite for React bindings.

```bash
npm install mobx mobx-react-lite recharts
#or
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

9. Create Dockerfile

For production later, use:
```bash
RUN yarn build
CMD ["yarn", "start"]
```

### For server side of the project 
---


**Use command inside <u>apps/</u> directory to initialize it:**

1. Create NestJS project

```bash
npm install -g @nestjs/cli
#or
yarn global add @nestjs/cli

nest new server
```

2. Install PostgreSQL & TypeORM dependencies

```bash
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
#or
yarn add @nestjs/typeorm typeorm pg
yarn add @nestjs/config
```

3. Add dependencies for WebSocket (NestJS does not ship @nestjs/websockets or socket.io by default)

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
npm install -D @types/socket.io
#or
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
DB_HOST
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

6. Create Dockerfile

* If you later want to build a production image, change CMD to
CMD ["yarn", "start:prod"] and build with the compiled /dist folder.

## GitHub Actions
   - Run tests, lint, build
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - DB is managed in Supabase


## Deployment
---

### Deploy database on Supabase
---

- Go to Supabase -> Register / Login -> Create a project
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

### Deploy backend on Railway / Render
---

- Go to Railway / Render -> Register / Login -> Create a project (chose gitHub repo and set /apps/server as root folder)
- Add env variables : click on project in dashboard -> go to Variables tab (there are 8 default service variables) -> add variables (DB_HOST
DB_PORT,
DB_USER,
DB_PASS,
DB_NAME,
FRONT_BASE_URL,
PORT)
- For Railway: 
  - Generate domain : click on project in dashboard -> go to Settings tab -> Networking section -> Generate domain (you get like name_of_project-environment.up.railway.app)
- For Render: 
  - Copy domain : click on project in dashboard -> at the top of project info copy autogenerated domain name (you get like name_of_project.onrender.com)

### Deploy frontend on Vercel
---

- Go to Vercel -> Register / Login -> Create a project (chose gitHub repo and set /apps/client as root folder)
- Add env variables : click on project in dashboard -> go to Settings tab -> Environment Variables side menu -> add variables (NEXT_PUBLIC_BACK_API_URL, NEXT_PUBLIC_WS_URL)
- Get domain : go to Overview tab in dashboard -> copy Domain


## OAuth authentication
---

### **Add env variables** in /apps/server/.env

```bash
# JWT & Cookies
JWT_SECRET=super-secret-change-me
JWT_EXPIRES=7d
COOKIE_NAME=pg_auth
COOKIE_SECURE= #true in production (only send over HTTPS) | false in local dev (so it works on http://localhost)

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx

# GitHub OAuth
GITHUB_CLIENT_ID=xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxx

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=xxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxx
```

#### 🔐 JWT / Cookies
---
These are for your **NestJS auth server** only:

- **`JWT_SECRET`** → make up a strong random string (e.g. from [1password generator](https://1password.com/password-generator/), `openssl rand -hex 32`, etc.).  

  Example:  
```bash
  JWT_SECRET=2fd44a2a8aa3d939f5ce3f6f0f40b07c
```
- **`JWT_EXPIRES`** → how long the token should live (any jsonwebtoken format, e.g. 7d, 1h, 30m).

- **`COOKIE_NAME`** → arbitrary name for the cookie you’ll store the JWT in.

Example:

```bash
COOKIE_NAME=pg_auth
```
- **`COOKIE_SECURE`** →

- `true` in production (only send over HTTPS)
- `false` in local dev (so it works on http://localhost:3000)

#### 🌐 Google OAuth
---

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **new project** (or reuse one).
3. Enable **Google+ API / Google Identity Services**.
4. Go to **APIs & Services > Credentials → Create OAuth 2.0 Client ID**.
    - Application type = **Web application**
    - Add **Authorized redirect URI**:

```bash
http://localhost:3001/auth/google/callback

* (replace 3001 with your NestJS backend port)
```

Copy values into your .env:
```bash
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx
```
#### 🐙 GitHub OAuth
---

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
    - Homepage URL = `http://localhost:3000` (Next.js client)
    - Authorization callback URL = `http://localhost:3001/auth/github/callback`

3. Register, then copy values into .env:
```bash
GITHUB_CLIENT_ID=xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxx
```

#### 💼 LinkedIn OAuth
---

1. Go to [LinkedIn Developers](https://developer.linkedin.com/).
2. Create an **App**.
3. In the App, go to **Auth tab**.
    - Add redirect URL:
```bash
http://localhost:3001/auth/linkedin/callback
```
4. Copy values into .env:
```bash
LINKEDIN_CLIENT_ID=xxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxx
```

### **Install necessary dependencies** (in root folder)
```bash
yarn workspace server add @nestjs/passport passport @nestjs/jwt passport-jwt
yarn workspace server add passport-google-oauth20 passport-github2 passport-linkedin-oauth2
```