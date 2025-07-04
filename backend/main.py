from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
from datetime import datetime, timedelta
from firebase import db
from firebase_admin import auth
from typing import Optional

app = FastAPI()

SPACING_DAYS = [1, 3, 7, 15, 30]

def verify_token(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

class ProblemLog(BaseModel):
    title: str
    difficulty: int
    result: str
    tags: list[str] = []

# 🔄 Log a problem
@app.post("/log")
def log_problem(data: ProblemLog, user_id: str = Depends(verify_token)):
    now = datetime.utcnow()
    stage = 0 if data.result == "fail" else 1
    next_review = now + timedelta(days=SPACING_DAYS[stage])

    doc_ref = db.collection(f'users/{user_id}/leetcode_problems').document(data.title)
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

@app.get("/reviews")
def get_todays_reviews(user_id: str = Depends(verify_token)):
    now = datetime.utcnow()
    docs = db.collection(f'users/{user_id}/leetcode_problems') \
             .where("next_review_date", "<=", now).stream()

    reviews = [doc.to_dict() for doc in docs]
    return {"reviews_due": reviews}


@app.get("/all_problems")
def get_all_problems(user_id: str = Depends(verify_token)):
    docs = db.collection(f'users/{user_id}/leetcode_problems').stream()
    all_problems = [doc.to_dict() for doc in docs]
    return {"all_problems": all_problems}
