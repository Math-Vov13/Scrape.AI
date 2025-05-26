from fastapi import APIRouter, Body, status, UploadFile
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile):
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "message": "File received",
        "filename": file.filename,
        "content_type": file.content_type
    })