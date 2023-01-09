FROM node:lts-alpine

WORKDIR /usr/src/app

COPY prisma ./prisma/
COPY ["package.json", "./"]

RUN npm install --production
RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
