# Use an official Node.js runtime as the base image for the build stage
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app using Vite
RUN npm run build


# Use a smaller image to serve the built app (e.g., nginx)
FROM nginxinc/nginx-unprivileged:latest

RUN chmod -R g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chown -R nginx:0 /usr/share/nginx/html && \
    chmod -R g+rwX /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build files from the build stage to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will use 
EXPOSE 5173

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
