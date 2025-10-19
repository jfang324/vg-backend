FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install

RUN echo "Listing generated folder recursively before :" && ls -laR generated || echo "generated folder not found"

COPY . .

RUN echo "Listing generated folder recursively after :" && ls -laR generated || echo "generated folder not found"

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]