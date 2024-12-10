FROM node:16

WORKDIR /app/todo_frontend

COPY ./todo_frontend/package*.json ./
RUN npm install -g serve

COPY . .

RUN ls -la /app

RUN apt-get update && apt-get install -y

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
