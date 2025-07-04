from fastapi import FastAPI, Request
from pydantic import BaseModel
from datetime import datetime, timedelta
from firebase import db
import os

app = FastAPI()

SPACING_DAYS = [1, 3, 7, 15, 30]

class ProblemLog(BaseModel):
    user_id: str
    title: str
    difficulty: int
    result: str
    tags: list[str] = []

@app.post("/log")
def log_problem(data: ProblemLog):
    now = datetime.utcnow()
    stage = 0 if data.result == "fail" else 1
    next_review = now + timedelta(days=SPACING_DAYS[stage])

    doc_ref = db.collection(f'users/{data.user_id}/leetcode_problems').document(data.title)
    doc_ref.set({
        "title": data.title,
        "difficulty": data.difficulty,
        "last_result": data.result,
        "review_stage": stage,
        "date_solved": now,
        "next_review_date": next_review,
        "tags": data.tags
    })
    return {"message": f"{data.title} logged!", "next_review": next_review.date()}

@app.get("/reviews/{user_id}")
def get_todays_reviews(user_id: str):
    now = datetime.utcnow()
    docs = db.collection(f'users/{user_id}/leetcode_problems') \
             .where("next_review_date", "<=", now).stream()

    reviews = []
    for doc in docs:
        reviews.append(doc.to_dict())

    return {"reviews_due": reviews}
