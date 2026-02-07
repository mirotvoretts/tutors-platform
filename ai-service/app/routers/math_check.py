from fastapi import APIRouter

router = APIRouter()

@router.post("/check-answer")
def check():
    return {"status": "mock_check"}
