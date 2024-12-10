FROM node:16

WORKDIR /app/todo_frontend

COPY ./package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npx", "serve", "-s", "build", "-l", "80"]
