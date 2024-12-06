FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install -g serve

COPY . .

RUN ls -la /app

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
