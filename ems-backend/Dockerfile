FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# This step is missing on GitHub and is required to create the dist folder
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]