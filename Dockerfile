FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

RUN useradd --create-home --uid 10001 appuser
USER 10001

EXPOSE 8001
CMD ["uvicorn", "src.server.protection_api:app", "--host", "0.0.0.0", "--port", "8001"]
