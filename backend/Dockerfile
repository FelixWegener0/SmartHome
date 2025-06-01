FROM node:lts AS node

COPY ./ ./docker
WORKDIR /docker

RUN npm install
RUN npm build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
