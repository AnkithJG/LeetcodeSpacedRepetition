import json
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("backend/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def difficulty_to_string(level):
    return {1: "Easy", 2: "Medium", 3: "Hard"}.get(level, "Medium")

with open("scripts/problemslist.json", "r") as f:
    data = json.load(f)

problems = data["stat_status_pairs"]

for item in problems:
    stat = item["stat"]
    title = stat["question__title"]
    slug = stat["question__title_slug"]
    level = item["difficulty"]["level"]
    
    doc = {
        "title": title,
        "slug": slug,
        "difficulty": difficulty_to_string(level),
        "tags": [] 
    }

    db.collection("leetcode_problems_db").document(slug).set(doc)

print(f"Uploaded {len(problems)} problems.")
