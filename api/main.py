from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

# Import chatbot wrappers
from mentor.graph import MentorChatbot
from learning.graph import LangGraphChatbot

# Instantiate bots (simple single-session bots; extend as needed)
mentor_bot = MentorChatbot()
learning_bot = LangGraphChatbot()

app = FastAPI(title="Evo Chat Backend")

# Allow local frontend (localhost:3000) – adjust for prod
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*",  # remove wildcard in production
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.post("/chat/mentor", response_model=ChatResponse)
async def chat_mentor(req: ChatRequest):
    """Chat with the mentor bot."""
    reply = mentor_bot.chat(req.message)
    return {"reply": reply}


@app.post("/chat/learning", response_model=ChatResponse)
async def chat_learning(req: ChatRequest):
    """Chat with the learning bot."""
    reply = learning_bot.chat(req.message)
    return {"reply": reply}


@app.post("/chat_stream/mentor")
async def chat_stream_mentor(req: ChatRequest):
    """Stream response tokens from mentor bot."""
    def token_gen():
        for t in mentor_bot.chat_stream(req.message):
            yield t

    return StreamingResponse(token_gen(), media_type="text/plain")


@app.post("/chat_stream/learning")
async def chat_stream_learning(req: ChatRequest):
    """Stream tokens from learning bot."""
    def token_gen():
        for t in learning_bot.chat_stream(req.message):
            yield t

    return StreamingResponse(token_gen(), media_type="text/plain")


# Health check
@app.get("/")
async def root():
    return {"status": "ok"} 