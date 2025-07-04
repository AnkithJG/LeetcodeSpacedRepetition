import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

USER_ID = os.getenv("USER_ID")  

def log_problem(title, difficulty, result, tags=[]):
    doc_ref = db.collection(f'users/{USER_ID}/leetcode_problems').document(title)

    now = datetime.utcnow()
    stage = 0 if result == 'fail' else 1
    spacing_days = [1, 3, 7, 15, 30]

    next_review = now + timedelta(days=spacing_days[stage])

    doc_ref.set({
        "title": title,
        "difficulty": difficulty,
        "last_result": result,
        "review_stage": stage,
        "date_solved": now,
        "next_review_date": next_review,
        "tags": tags
    })

    print(f"Logged: {title} | Next review: {next_review.date()}")

def get_todays_reviews():
    now = datetime.utcnow()
    docs = db.collection(f'users/{USER_ID}/leetcode_problems') \
             .where("next_review_date", "<=", now).stream()
    
    print("Today's Review List:\n")
    for doc in docs:
        data = doc.to_dict()
        print(f"- {data['title']} (difficulty {data['difficulty']}, last_result: {data['last_result']})")

# Example usage:
# log_problem("LRU Cache", 3, "fail", ["hashmap", "design"])
# get_todays_reviews()
