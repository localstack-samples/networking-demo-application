FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN python -m venv .venv && \
    .venv/bin/python -m pip install -r requirements.txt
COPY app.py /app/app.py
COPY templates /app/templates
COPY static /app/static

CMD ["/app/.venv/bin/python", "-m", "flask", "run", "--host", "0.0.0.0"]
