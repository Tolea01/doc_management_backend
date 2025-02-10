FROM node:18
WORKDIR /backend-app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 4200
CMD [ "yarn", "start:dev" ]