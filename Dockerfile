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

RUN chmod -R 755 /app

# Build the React app
RUN npm run build

# Step 2: Set up the production environment
FROM nginx:alpine

RUN chmod 777 /etc/nginx/conf.d/default.conf

# Copy the build folder from the build stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
