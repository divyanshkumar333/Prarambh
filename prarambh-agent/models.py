from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PersonInfo(BaseModel):
    name: str
    role: str = ""
    company: str = ""

class GenerateRequest(BaseModel):
    person_info: PersonInfo
    prompt: str = ""
    assigned_by: str = "system"
    assigned_by_name: str = "System"

class GenerateResponse(BaseModel):
    tasks: List[Dict[str, Any]]
    message: str
    total: int

class RefineRequest(BaseModel):
    current_tasks: List[Dict[str, Any]]
    instruction: str
    person_info: PersonInfo
    assigned_by: str = "system"
    assigned_by_name: str = "System"

class RefineResponse(BaseModel):
    tasks: List[Dict[str, Any]]
    message: str
    total: int
    changes_summary: str
