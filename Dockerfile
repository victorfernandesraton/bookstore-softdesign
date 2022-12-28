# from base image node
FROM node:19-alpine

WORKDIR /usr/app

COPY package.json .


RUN npm install --save

COPY . .