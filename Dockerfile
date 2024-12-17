# Step 1: Use the official Node.js image as the base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json files
# This is done separately to leverage Docker's cache (faster builds)
COPY package*.json ./

# Step 4: Install project dependencies
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Expose the port the app will run on
EXPOSE 5000

# Step 7: Command to run the application
CMD ["node", "server.js"]
