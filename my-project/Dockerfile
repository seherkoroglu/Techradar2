# 1. Aşama: Vite ile build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. Aşama: Nginx ile servis et
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
