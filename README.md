# EchoGPT Backend API

Backend REST API for the EchoGPT Chrome Extension assignment, built with NestJS, PostgreSQL, Prisma, and documented with Swagger.

## Quick Note

- Kept the scope focused on core features instead of spreading thin.
- I don't have a debit or credit card to sign up for OpenAI, Anthropic, or Gemini API access. So the AI provider integration runs in mock mode. Set `USE_MOCK_PROVIDERS=true` in `.env` to use it.
- The real provider calls are already written in code. Mock mode only replaces the actual HTTP request. Provider selection, chat, and usage limits all work the same either way.

## Project Setup

**1. Prerequisites:** Node.js (v18+), PostgreSQL running locally (no Docker used).

**2. Clone and install**

```bash
git clone https://github.com/md-musa/echogpt.git
cd echogpt-backend
npm install
```

**3. Set up the database**

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE echogpt;
CREATE USER echogpt_user WITH PASSWORD 'devpassword';
GRANT ALL PRIVILEGES ON DATABASE echogpt TO echogpt_user;
ALTER DATABASE echogpt OWNER TO echogpt_user;
\q
```

**4. Configure environment**

```bash
cp .env.example .env
```

Fill in the values — see the table below.

**5. Run migrations**

```bash
npx prisma migrate dev
```

**6. Create an admin account**
There's no seed script — register a normal account through `POST /auth/register`, then promote it to admin manually:

```bash
npx prisma studio
```

Open the `User` table, find your account, and change `role` from `USER` to `ADMIN`. Log in again afterward so your token reflects the new role.

**7. Run**

```bash
npm run start:dev
```

Runs at `http://localhost:3000`.

## API Docs

Swagger UI: `http://localhost:3000/docs` — click **Authorize** and paste an access token to test protected routes directly.

## Environment Variables

| Variable                                           | Description                                       |
| -------------------------------------------------- | ------------------------------------------------- |
| `DATABASE_URL`                                     | PostgreSQL connection string                      |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`         | JWT signing secrets                               |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes                                   |
| `ENCRYPTION_KEY`                                   | 32-character key for encrypting provider API keys |
| `USE_MOCK_PROVIDERS`                               | `true` to mock AI responses instead of real calls |
| `PORT`                                             | Server port (default 3000)                        |

## Security Notes

- Passwords hashed with bcrypt
- Provider API keys encrypted at rest, only a masked preview ever returned
- Refresh tokens stored as hashes, delivered via httpOnly cookie
- Global input validation, `helmet` enabled, auth routes rate-limited
