#!/bin/sh

export AWS_PROFILE=atsumari

docker tag mecab-lambda:latest 126258523001.dkr.ecr.$1.amazonaws.com/mecab-edge:latest

docker push 126258523001.dkr.ecr.$1.amazonaws.com/mecab-edge:latest