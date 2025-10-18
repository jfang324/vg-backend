FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY generated ./generated
RUN npm install

RUN ls -la generated

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]