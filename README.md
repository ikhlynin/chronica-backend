# Chronica Backend

Chronica Backend — server-side of the news aggregator providing REST API for fetching and processing news feeds, user management, and service health monitoring.

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/ikhlynin/chronica-backend`
cd chronica-backend
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure environment variables**
Create a `.env` file in root directory:
```env
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="toor"
DATABASE_URL="mongodb://root:toor@localhost:27017/mydb?authSource=admin"
```

4. **Run MongoDB with Docker Compose:**
```bash
docker-compose up -d
```

5. **npx prisma generate:**
```
npx prisma generate
```

6. **Run development server**
```bash
yarn dev` or `npm run dev
```

Server will start at http://localhost:3000
