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

# Set file permissions (for all files in the app)
RUN chmod -R 755 /app

# Build the React app
RUN npm run build

# Step 2: Set up the production environment
FROM nginx:alpine

# Copy the build folder from the build stage to the Nginx server
COPY --from=build /app/build /usr/share/nginx/html

# Set permissions for Nginx config files
RUN chmod -R 755 /etc/nginx/conf.d/ && \
    chmod 644 /etc/nginx/conf.d/default.conf

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
