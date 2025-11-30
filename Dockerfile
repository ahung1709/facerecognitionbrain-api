FROM node:22-alpine

WORKDIR /usr/src/face-recognition-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/sh"]