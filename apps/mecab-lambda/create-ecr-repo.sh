#!/bin/sh

export AWS_PROFILE=atsumari

aws ecr get-login-password --region $1 | docker login --username AWS --password-stdin 126258523001.dkr.ecr.$1.amazonaws.com

aws ecr create-repository --repository-name mecab-edge --region $1 --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE