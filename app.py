import uuid
from functools import lru_cache
import json

from flask import Flask, request, render_template, redirect, flash, url_for
import boto3
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "secret-key"


@lru_cache
def client_factory(service: str):
    return boto3.client(service, endpoint_url="http://localhost.localstack.cloud:4566")


ssm_client = client_factory("ssm")
s3_client = client_factory("s3")
sqs_client = client_factory("sqs")
dynamo_client = client_factory("dynamodb")

# Set up constants
raw_ssm_parameters = ssm_client.get_parameters_by_path(Path="/network-demo", Recursive=True)[
    "Parameters"
]
ssm_parameters = {every["Name"]: every["Value"] for every in raw_ssm_parameters}


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
        filename = secure_filename(file.filename)
        file_id = str(uuid.uuid4())
        s3_key = f"raw/{file_id}"
        s3_client.upload_fileobj(file, ssm_parameters["/network-demo/bucket"], s3_key)

        # enqueue message
        sqs_client.send_message(
            QueueUrl=ssm_parameters["/network-demo/queue"],
            MessageBody=json.dumps(
                {
                    "id": file_id,
                    "bucket": ssm_parameters["/network-demo/bucket"],
                    "filename": filename,
                }
            ),
        )

        flash("File uploaded!")
        return redirect(url_for("index"))
    return render_template(url_for("index"), error=error)


@app.route("/results")
def results():
    pages = dynamo_client.get_paginator("scan").paginate(
        TableName=ssm_parameters["/network-demo/table"]
    )
    file_sizes = []
    for page in pages:
        file_sizes.extend(page["Items"])
    return render_template("results.html", file_sizes=file_sizes)
