from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
from datetime import datetime, timedelta
from backend.firebase_config import db
from firebase_admin import auth
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    slug: str              
    title: str             
    difficulty: int       
    result: str           
    tags: list[str] = []

def calculate_next_review(difficulty: int, last_result: str, last_review_date: Optional[datetime]) -> datetime:
    now = datetime.utcnow()
    
    if last_result == "fail" or not last_review_date:
        base_days = {1: 1, 2: 1, 3: 1}
        return now + timedelta(days=base_days[difficulty])
    
    days_since_last = (now - last_review_date).days
    difficulty_multiplier = {1: 2.0, 2: 1.5, 3: 1.2}
    max_spacing = 60

    next_gap = min(int(days_since_last * difficulty_multiplier[difficulty]), max_spacing)
    return now + timedelta(days=max(1, next_gap))

@app.post("/log")
def log_problem(data: ProblemLog, user_id: str = Depends(verify_token)):
    problem_doc = db.collection("leetcode_problems_db").document(data.slug).get()
    if not problem_doc.exists:
        raise HTTPException(status_code=400, detail="Problem does not exist in database")

    now = datetime.utcnow()

    user_doc = db.collection(f'users/{user_id}/leetcode_problems').document(data.slug).get()
    last_review_date = None
    if user_doc.exists:
        last_review_date = user_doc.to_dict().get("date_solved")
        if last_review_date:
            last_review_date = last_review_date.replace(tzinfo=None)

    next_review = calculate_next_review(data.difficulty, data.result, last_review_date)

    doc_ref = db.collection(f'users/{user_id}/leetcode_problems').document(data.slug)
    doc_ref.set({
        "slug": data.slug,
        "title": data.title,
        "difficulty": data.difficulty,
        "last_result": data.result,
        "date_solved": now,
        "next_review_date": next_review,
        "tags": data.tags
    })
    return {"message": f"{data.title} logged!", "next_review": next_review.date()}

@app.get("/reviews")
def get_todays_reviews(user_id: str = Depends(verify_token)):
    now = datetime.utcnow()

    due_docs = db.collection(f'users/{user_id}/leetcode_problems') \
                 .where("next_review_date", "<=", now).stream()

    due_reviews = [doc.to_dict() for doc in due_docs]

    if due_reviews:
        return {"reviews_due": due_reviews}

    upcoming_docs = db.collection(f'users/{user_id}/leetcode_problems') \
                      .order_by("next_review_date") \
                      .limit(1) \
                      .stream()

    next_up = [doc.to_dict() for doc in upcoming_docs]

    return {
        "reviews_due": [],
        "next_up": next_up[0] if next_up else None
    }

@app.get("/all_problems")
def get_all_problems(user_id: str = Depends(verify_token)):
    docs = db.collection(f'users/{user_id}/leetcode_problems').stream()
    all_problems = [doc.to_dict() for doc in docs]
    return {"all_problems": all_problems}
