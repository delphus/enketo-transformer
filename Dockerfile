FROM node:8-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk add -u python2 libxml2 make g++ && npm install

COPY . .

EXPOSE 8085
CMD [ "npm", "start" ]