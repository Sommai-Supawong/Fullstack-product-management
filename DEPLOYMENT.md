# Deploy to Vercel with Neon

This repository contains two independent applications. Create **two Vercel
projects** from the same Git repository.

## 1. Deploy the backend

Create the first Vercel project with these settings:

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Framework Preset | Express (auto-detected) |

The backend exports its Express application from `backend/index.js`. On Vercel
it is executed as a function, so no `PORT` environment variable is required.

Connect Neon from **Vercel → Storage/Marketplace → Neon**, and connect it to
the backend project. Confirm that the backend project has this environment
variable:

```env
DATABASE_URL=postgresql://...
```

Use Neon's pooled connection string for the deployed API. It normally contains
`-pooler` in the hostname. Apply the variable to Production and Preview as
needed, then redeploy the backend.

After the frontend has a production URL, add this variable to the backend:

```env
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
```

For multiple allowed origins, use a comma-separated value with no trailing
slash:

```env
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app,https://www.example.com
```

Redeploy and verify these endpoints:

```text
https://YOUR-BACKEND.vercel.app/health
https://YOUR-BACKEND.vercel.app/products
```

## 2. Deploy the frontend

Create the second Vercel project from the same repository:

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add the backend base URL to the frontend project:

```env
VITE_API_URL=https://YOUR-BACKEND.vercel.app
```

Do not append `/products`; the frontend adds that path itself. Redeploy the
frontend after changing any `VITE_*` variable because Vite embeds these values
during the build.

## Local development

The production variables above do not replace local configuration. For local
development, use:

```env
# frontend/.env
VITE_API_URL=http://localhost:5000
```

Copy `backend/.env.example` to `backend/.env` and keep the local PostgreSQL
defaults, or replace `DATABASE_URL` with a development Neon database URL.

Do not commit either application's real `.env` values or a Neon connection
string.
