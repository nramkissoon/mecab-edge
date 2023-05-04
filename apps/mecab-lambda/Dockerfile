ARG FUNCTION_DIR="/function"

FROM node:18 as build-image

RUN apt-get update && apt-get install -y g++ \
  make \
  cmake \
  unzip \
  libcurl4-openssl-dev \
  mecab \
  libmecab-dev \
  mecab-ipadic-utf8

# Include global arg in this stage of the build
ARG FUNCTION_DIR
# Create function directory
RUN mkdir -p ${FUNCTION_DIR}

RUN npm install -g aws-lambda-ric

COPY ./entry_script.sh /entry_script.sh
RUN chmod +x /entry_script.sh

ADD aws-lambda-rie-x86_64 /usr/local/bin/aws-lambda-rie
RUN chmod +x /usr/local/bin/aws-lambda-rie

# Copy function code
COPY dist/* ${FUNCTION_DIR}/

WORKDIR ${FUNCTION_DIR}

RUN npm install

EXPOSE 8080

ENTRYPOINT [ "/entry_script.sh" ]
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]