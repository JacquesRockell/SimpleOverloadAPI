FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DB_CONNECTION=mongodb+srv://jacquesrockell:v2hCKdZRd6kwpMN@jrcluster0.wd77u.mongodb.net/SimpleOverload?retryWrites=true&w=majority

ENV TOKEN_SECRET=tsasd

EXPOSE 8080

CMD [ "npm", "start" ]
