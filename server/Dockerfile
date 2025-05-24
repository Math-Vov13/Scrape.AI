FROM python:3.13-alpine

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./src /code/src
COPY ./logs /code/logs

EXPOSE 80

CMD ["fastapi", "run", "/code/src/main.py", "--port", "80"]