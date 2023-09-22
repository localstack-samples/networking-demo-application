import uuid
from functools import lru_cache
import os

from flask import Flask, request, render_template, redirect, flash, url_for
import boto3

app = Flask(__name__)
app.secret_key = "secret-key"

BUCKET_NAME = os.environ["BUCKET_NAME"]
QUEUE_URL = os.environ["QUEUE_URL"]


@lru_cache
def client_factory(service: str):
    return boto3.client(service, endpoint_url="http://localhost.localstack.cloud:4566")


s3_client = client_factory("s3")
sqs_client = client_factory("sqs")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def handle_upload():
    error = None
    file = request.files.get("file")
    if not file:
        error = "No file specified"
    else:
        # TODO: secure filename
        file_id = str(uuid.uuid4())
        s3_key = f"raw/{file_id}"
        s3_client.upload_fileobj(file, BUCKET_NAME, s3_key)

        # enqueue message

        flash("File uploaded!")
        return redirect(url_for("index"))
    return render_template(url_for("index"), error=error)
