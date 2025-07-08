from sqlmodel import SQLModel, Field, Column, JSON
from typing import Optional, List
from datetime import datetime

class LeetcodeProblem(SQLModel, table=True):
    slug: str = Field(primary_key=True)
    title: str
    official_difficulty: str
    tags: List[str] = Field(sa_column=Column(JSON))

class UserProblem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    slug: str
    title: str
    difficulty: int
    date_solved: datetime
    next_review_date: datetime
    tags: List[str] = Field(sa_column=Column(JSON))