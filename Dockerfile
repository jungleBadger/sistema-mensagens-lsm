FROM node:14.16.1
WORKDIR /usr/src/app
ARG FA_KEY
ARG GSAP_KEY

COPY package*.json ./
COPY . .

RUN echo //npm.fontawesome.com/:_authToken=${FA_KEY} >> .npmrc
RUN echo @fortawesome:registry=https://npm.fontawesome.com/ >> .npmrc

RUN echo //npm.greensock.com/:_authToken=${GSAP_KEY} >> .npmrc
RUN echo @gsap:registry=https://npm.greensock.com >> .npmrc

RUN cd client && npm install
RUN cd client && npm build:all

RUN cd server && npm install
RUN cd server && npm run lint

EXPOSE 3030

CMD [ "server", "npm", "server:start" ]
