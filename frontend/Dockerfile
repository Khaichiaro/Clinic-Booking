FROM node:18-alpine AS build
WORKDIR /app
COPY . .

# ติดตั้ง dependencies ที่ขาดก่อน
RUN npm install react-router-dom && \
    npm install --save-dev @types/react-router-dom

# ติดตั้ง dependencies ที่เหลือ และ build
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
