FROM python:3.11-slim

# install curl for the health check
RUN apt-get update && \
    apt-get install -y curl

WORKDIR /app
COPY requirements.txt .
RUN python -m venv .venv && \
    .venv/bin/python -m pip install -r requirements.txt
COPY app.py /app/app.py
COPY templates /app/templates
COPY static /app/static

HEALTHCHECK --interval=2s --timeout=1s CMD curl --fail http://127.0.0.1:5000/health

CMD ["/app/.venv/bin/python", "-m", "flask", "run", "--host", "0.0.0.0"]
