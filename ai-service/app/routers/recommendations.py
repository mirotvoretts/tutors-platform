from fastapi import APIRouter

router = APIRouter()

@router.post("/generate")
def generate():
    return {"status": "mock_recommendation"}
