import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from supabase import create_client, Client
from dotenv import load_dotenv

# LLM
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from .prompts import UPDATE_MEMORY_PROMPT, CLUSTER_PROMPT, PATTERN_RECOGNITION_PROMPT

# ---------------------
# ENV + Supabase Setup
# ---------------------

load_dotenv()  # automatically load .env if present

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

# Fallback file storage (useful if Supabase creds not present)
MEMORY_FILE = Path(__file__).with_suffix(".jsonl")


def _get_supabase() -> Optional[Client]:
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    return None


# ------------------------------------------------------------------
# LLM helpers (different model/params per prompt)
# ------------------------------------------------------------------

# Config tuples: (model_name, temperature, top_p)
_EXTRACT_CFG = ("gpt-4o-mini", 0.2, 0.85)
_CLUSTER_CFG = ("gpt-4o-mini", 0.2, 0.85)
_SUMMARY_CFG = ("gpt-4.1", 0.4, 0.9)


def _llm(model: str, temp: float, top_p: float) -> ChatOpenAI:
    """Return a ChatOpenAI instance for given config."""
    return ChatOpenAI(model_name=model, temperature=temp, top_p=top_p)


def extract_facts(user_text: str, assistant_text: str) -> List[str]:
    """Run the UPDATE_MEMORY_PROMPT and return list of fact strings."""
    convo = f"User: {user_text}\nAssistant: {assistant_text}"
    system = SystemMessage(content=UPDATE_MEMORY_PROMPT)
    user_msg = HumanMessage(content=convo)
    resp = _llm(*_EXTRACT_CFG).invoke([system, user_msg])
    try:
        data = json.loads(resp.content)
        facts = data.get("facts", []) if isinstance(data, dict) else []
        if not isinstance(facts, list):
            return []
        return [str(f).strip() for f in facts if str(f).strip()]
    except Exception:
        return []


def classify_memory(memory: str) -> List[str]:
    """Run CLUSTER_PROMPT on single memory and return cluster list."""
    system = SystemMessage(content=CLUSTER_PROMPT)
    user_msg = HumanMessage(content=memory)
    resp = _llm(*_CLUSTER_CFG).invoke([system, user_msg])
    try:
        data = json.loads(resp.content)
        clusters: List[str] = data.get("cluster", []) if isinstance(data, dict) else []
        if not isinstance(clusters, list):
            return []
        return [str(c).strip() for c in clusters if str(c).strip()]
    except Exception:
        return []


def store_memory(memory: str, clusters: List[str]):
    """Persist memory to Supabase (if configured), else local file."""
    record = {
        "timestamp": datetime.utcnow().isoformat(),
        "memory": memory,
        "cluster": clusters,
    }

    client = _get_supabase()
    if client:
        try:
            client.table("memories").insert(record).execute()
            return
        except Exception as e:
            # fall back to file storage if Supabase insert fails
            print(f"[MentorMemory] Supabase insert failed: {e}. Falling back to local file.")

    # fallback: append to local JSONL
    with MEMORY_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def process_turn(user_text: str, assistant_text: str):
    """Extract facts from a turn, classify each, and store."""
    facts = extract_facts(user_text, assistant_text)
    for fact in facts:
        clusters = classify_memory(fact)
        store_memory(fact, clusters)

    # After storing, maybe generate high-level summary every 100 memories
    _maybe_generate_summary()


# ------------------------------------------------------------------
# Summary generation helpers
# ------------------------------------------------------------------


def _fetch_all_memories() -> List[dict]:
    """Return all memories as list of dicts (timestamp, memory, cluster)."""
    client = _get_supabase()
    if client:
        resp = client.table("memories").select("timestamp, memory, cluster").order("timestamp", desc=False).execute()
        return resp.data or []
    # fallback read from local file
    if MEMORY_FILE.exists():
        return [json.loads(line) for line in MEMORY_FILE.read_text(encoding="utf-8").splitlines() if line.strip()]
    return []


def _store_summary(summary: str, count: int):
    record = {
        "generated_at": datetime.utcnow().isoformat(),
        "memory_count": count,
        "summary": summary,
    }
    client = _get_supabase()
    if client:
        try:
            # Remove existing summaries so only the latest is kept
            client.table("memory_summaries").delete().neq("summary", "").execute()
            client.table("memory_summaries").insert(record).execute()
            return
        except Exception as e:
            print(f"[MentorMemory] Could not write summary to Supabase: {e}. Falling back to local file.")
    # fallback local
    summary_file = MEMORY_FILE.with_name("memory_summaries.jsonl")
    with summary_file.open("w", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def _maybe_generate_summary():
    memories = _fetch_all_memories()
    count = len(memories)
    if count == 0 or count % 100 != 0:
        return  # only run at 100, 200, 300, ...

    # Build structured text grouped by the five cluster categories
    cluster_names = [
        "Habit Patterns",
        "Goal Progress & Milestones",
        "Emotional State & Trends",
        "Motivational Factors",
        "Obstacles & Challenges",
    ]

    grouped: dict[str, list[str]] = {name: [] for name in cluster_names}

    for m in memories:
        ts = m["timestamp"]
        text = m["memory"]
        for cl in m.get("cluster", []):
            if cl in grouped:
                grouped[cl].append(f"- [{ts}] {text}")

    # Compose dataset with only 5 titles and their memory lines
    dump_lines: list[str] = []
    for name in cluster_names:
        dump_lines.append(f"{name}:")
        dump_lines.extend(grouped[name] or ["- (none)"])
        dump_lines.append("")  # blank line between sections

    dataset = "\n".join(dump_lines)

    system = SystemMessage(content=PATTERN_RECOGNITION_PROMPT)
    user_msg = HumanMessage(content=dataset)
    summary_resp = _llm(*_SUMMARY_CFG).invoke([system, user_msg])
    summary_text = summary_resp.content.strip()

    _store_summary(summary_text, count)


def get_latest_summary() -> str | None:
    """Return the most recent pattern-recognition summary or None."""
    client = _get_supabase()
    if client:
        try:
            resp = (
                client.table("memory_summaries")
                .select("summary")
                .order("generated_at", desc=True)
                .limit(1)
                .execute()
            )
            if resp.data:
                return resp.data[0]["summary"]
        except Exception:
            pass
    # fallback local file
    summary_file = MEMORY_FILE.with_name("memory_summaries.jsonl")
    if summary_file.exists():
        *_, last = summary_file.read_text(encoding="utf-8").splitlines() or [None]
        if last:
            try:
                return json.loads(last)["summary"]
            except Exception:
                pass
    return None 