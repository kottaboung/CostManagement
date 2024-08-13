# Step 1: Build the Angular app
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Step 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/costmanagement /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
