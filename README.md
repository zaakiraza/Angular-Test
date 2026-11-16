# ToDo app

A simple full-stack task manager with an Angular 22 frontend and a FastAPI backend. Tasks are stored in a local SQLite database.

## Requirements

- Node.js 22.12 or newer and npm
- Python 3.10 or newer

## Start the backend

From the project root, in PowerShell:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`; interactive API documentation is at `http://localhost:8000/docs`. The SQLite database is created as `backend/todo.db` on first startup.

## Start the frontend

In a second terminal, from the project root:

```powershell
cd frontend
npm start
```

Open `http://localhost:4200`. The app supports adding tasks with optional notes, filtering by status, completing tasks, and deleting tasks.
