FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-2023-02-20

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./data /data

COPY ./app /app