IMAGE_NAME ?= network-demo
BUCKET_NAME := uploads
PORT := 5000

help:                   ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/:.*##\s*/##/g' | awk -F'##' '{ printf "%-25s %s\n", $$1, $$2 }'

setup:
	BUCKET_NAME=$(BUCKET_NAME) bash ./setup.sh
