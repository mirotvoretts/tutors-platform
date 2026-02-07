from fastapi import APIRouter

router = APIRouter()

@router.post("/recognize")
def recognize():
    return {"status": "mock_ocr"}
