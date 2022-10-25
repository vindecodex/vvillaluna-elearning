FROM node:slim
WORKDIR /elearning
COPY ./package.json .
COPY . .
RUN npm install
EXPOSE 3000:3000
CMD npm run start:dev
