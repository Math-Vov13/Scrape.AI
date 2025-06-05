from typing import Annotated
from fastapi import APIRouter, Body, Depends, status, UploadFile
from fastapi.responses import JSONResponse
from src.endpoints.token import get_current_user
from src.models.files_db import *
from src.schema.users_sc import UserBase

router = APIRouter()


### FILES
@router.get("/files")
async def fetch_files(current_user: Annotated[UserBase, Depends(get_current_user)], limit: int = 100, offset: int = 0):
    """
    Endpoint to retrieve a list of files.
    """
    if not current_user.admin:
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, content={
            "message": "You do not have permission to view files!"
        })
    
    files = await get_files(limit=limit, offset=offset)
    if not files:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={
            "message": "No files found!"
        })
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "message": "Files retrieved successfully!",
        "files": [file.model_dump(mode="json") for file in files]
    })


@router.post("/upload")
async def upload_file(current_user: Annotated[UserBase, Depends(get_current_user)], files: list[UploadFile]):
    """
    Endpoint to upload a file.
    """
    if not current_user.admin:
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, content={
            "message": "You do not have permission to upload files!"
        })
    if not files:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={
            "message": "No files provided!"
        })
    if len(files) > 10:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={
            "message": "You can only upload up to 10 files at a time!"
        })
    if any(file.size > 10 * 1024 * 1024 for file in files):
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={
            "message": "File size exceeds the limit of 10MB!"
        })
    
    file_schemas = []
    for file in files:
        file_content = await file.read()
        file_schema = FileSchema(
            name= file.filename,
            #content= file_content,
            type= file.content_type,
            size= len(file_content),
            created_at= datetime.utcnow(),
            updated_at= datetime.utcnow()
        )
        file_schemas.append(file_schema)
    file_ids = await create_files(file_schemas)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        "message": "Files uploaded successfully!",
        "file_ids": [str(file_id) for file_id in file_ids]
    })

@router.delete("/files/{file_id}")
async def req_delete_file(file_id: str, current_user: Annotated[UserBase, Depends(get_current_user)]):
    """
    Endpoint to delete a file by its ID.
    """
    if not current_user.admin:
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, content={
            "message": "You do not have permission to delete files!"
        })
    
    if not file_id:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={
            "message": "File ID is required!"
        })
    
    deleted = await delete_file(file_id)
    if not deleted:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={
            "message": "File not found!"
        })
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "message": "File deleted successfully!"
    })