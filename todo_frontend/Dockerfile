
FROM node:18

WORKDIR /todo_frontend

COPY ./todo_frontend/package*.json ./

RUN npm install

COPY ./todo_frontend /todo_frontend

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
