FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY generated ./generated
RUN npm install

RUN echo "Listing generated folder recursively:" && ls -laR generated || echo "generated folder not found"

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]