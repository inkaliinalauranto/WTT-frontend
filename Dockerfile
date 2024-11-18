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
FROM nginx:stable-alpine
RUN chmod -R g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chown -R nginx:0 /usr/share/nginx/html && \
    chmod -R g+rwX /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8085

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]