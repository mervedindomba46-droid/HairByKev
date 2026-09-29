HAIR BY KEV — WEBSITE SOURCE CODE
==================================

What's inside
-------------
backend/          FastAPI server (bookings, reviews, photo storage, admin endpoints)
frontend/         React app (the whole website design + admin page)
memory/           Project notes
README.md         Project overview

What's NOT inside (on purpose, for security)
--------------------------------------------
- .env files with your database connection and secret keys
- Your MongoDB data (bookings, reviews, photos live in the database)
- node_modules / installed packages (they reinstall automatically)

To run this project yourself you need:
--------------------------------------
Backend environment variables (backend/.env):
  MONGO_URL="your-mongodb-connection-string"
  DB_NAME="your-database-name"
  CORS_ORIGINS="*"
  OWNER_UPLOAD_CODE="your-admin-passcode"
  EMERGENT_LLM_KEY="your-emergent-key"   (used for photo storage)

Frontend environment variable (frontend/.env):
  REACT_APP_BACKEND_URL="https://your-backend-address"

Run locally:
  backend:  pip install -r requirements.txt && uvicorn server:app --host 0.0.0.0 --port 8001
  frontend: yarn install && yarn start

Admin page: /admin  (passcode = your OWNER_UPLOAD_CODE)
