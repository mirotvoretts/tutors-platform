from app.celery_app import celery_app
import time

@celery_app.task
def process_solution_image(image_bytes: bytes):
    # Mock processing
    time.sleep(2)
    return {
        "text": "2x + 4 = 10",
        "math": ["2x + 4 = 10"],
        "confidence": 0.95
    }

@celery_app.task
def check_math_answer(student_answer: str, correct_answer: str):
    return {"is_correct": student_answer == correct_answer}
