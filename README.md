# Evo Chat

A full-stack AI-powered mentorship and learning platform built with FastAPI, LangGraph/LangChain, and Next.js.

---

## Project structure

```
v2/
├── api/            # FastAPI backend (chat endpoints)
├── learning/       # GPT-4.1 "Learning" agent + LangGraph
├── mentor/         # GPT-4.1 "Mentor" agent + memory subsystem
├── frontend/       # Next.js / React client
├── requirements.txt
└── README.md       # you are here
```

*Both* the backend and memory engine rely on OpenAI models. Make sure you have an OpenAI API key set before running.

---

## Prerequisites

1. **Python 3.10+** (for the backend)
2. **Node.js 20+** (for the frontend)
3. An **OpenAI API key** (`OPENAI_API_KEY`)
4. (Optional) **Supabase** credentials if you want to persist long-term memory:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY`

Create a `.env` file in the project root (it is already in `.gitignore`) and add:

```env
OPENAI_API_KEY=sk-...
# Optional Supabase
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...   # or SUPABASE_ANON_KEY
```

---

## Getting started

### 1. Clone & set up the repo

```bash
# Clone (replace YOUR_GITHUB_USERNAME)
$ git clone https://github.com/YOUR_GITHUB_USERNAME/evo-chat.git
$ cd evo-chat

# Create & activate a Python virtual env (recommended)
$ python -m venv venv
$ source venv/bin/activate  # Windows: venv\Scripts\activate

# Install backend deps
(venv) $ pip install -r requirements.txt

# Install frontend deps
(venv) $ cd frontend && npm ci && cd ..
```

### 2. Run the backend

```bash
(venv) $ uvicorn api.main:app --reload --port 8000
```

Endpoints now live at http://localhost:8000 (see `/docs` for Swagger UI).

### 3. Run the frontend

```bash
(venv) $ cd frontend
(venv) $ npm run dev
```

Visit http://localhost:3000 – the dashboard should connect to the FastAPI backend out of the box thanks to CORS settings.

---

## Deployment

* Docker & CI/CD scripts are not included yet. Feel free to open a PR if you add them! :)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT © 2024 Mason 