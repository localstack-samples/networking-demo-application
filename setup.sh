#!/usr/bin/env bash

set -euo pipefail
set -x

STACK_NAME=network-demo
stacks=$(awslocal cloudformation list-stacks --query StackSummaries[].StackName --output text)

if ! echo "$stacks" | grep -q $STACK_NAME; then
    awslocal cloudformation create-stack --stack-name network-demo --template-body file://cloudformation.yml
    awslocal cloudformation wait stack-create-complete --stack-name network-demo
fi

