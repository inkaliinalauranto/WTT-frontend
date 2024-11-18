# Step 1: Use an official Node.js image to build the app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application into the container
COPY . .

# Build the React app
RUN npm run build

# Step 2: Set up the production environment
FROM nginxinc/nginx-unprivileged:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]