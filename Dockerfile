FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install

RUN echo "Listing generated folder recursively before :" && ls -laR generated || echo "generated folder not found"
RUN echo "Listing ./generated/openapi/api-client folder recursively before :" && ls -laR ./generated || echo "generated folder not found"

COPY . .
copy generated ./generated

RUN echo "Listing generated folder recursively after :" && ls -laR generated || echo "generated folder not found"
RUN echo "Listing ./generated/openapi/api-client folder recursively after :" && ls -laR ./generated || echo "generated folder not found"

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]