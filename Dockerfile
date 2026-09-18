FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
# Замініть 5000 на порт, на якому працює ваш бекенд-сервер
EXPOSE 3012 
CMD ["node", "start"] 
