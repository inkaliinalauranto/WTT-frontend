# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Remove potential cached issues
RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the React app using Vite
RUN npm run build

# Use a smaller image to serve the built app (e.g., nginx)
FROM nginxinc/nginx-unprivileged:latest

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port that nginx will use
EXPOSE 5173

# Start nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
