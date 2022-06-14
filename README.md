# Dockerizing a Node.js web appp

## catalogue

- [Dockerizing a Node.js web appp](#dockerizing-a-nodejs-web-appp)
  - [catalogue](#catalogue)
  - [Create the Node.js app](#create-the-nodejs-app)
  - [Creating a `Dockerfile`](#creating-a-dockerfile)

## Create the Node.js app

First,create a new directory where all files would live, and the navigate to this directory to initialize the app with the following command:

```sh
npm init
```

Now, a new file named `package.json` has been created in root directory which describes your app and its dependencies.

Then, create a new file called `app.js` that defines a web app using the [Express.js](https://expressjs.com/) framework:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to you");
});

app.use((err, req, res, naxt) => {
  if (err) {
    res.send(err);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
```

To run the app inside a Docker container using the offcial Docker image, we need to do the next steps:

## Creating a `Dockerfile`

Create a new file called `Dockerfile` and in the root directory:

```sh
touch Dockerfile
```

Edit it:
```Dockerfile
# ./Dockerfile
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where availabel (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# Run npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
```

- step 1/7: We use node:16 as a base image (alpine because it is very small in size).
- step 2/7: Then we create a working directory /app inside the container.
- step 3/7: Then copy package.json and package-lock.json to the /app folder.
- step 4/7: Run npm install to install dependencies (express and mysql).
- step 5/7: Copy the remaining files (make sure to create .dockerignore file and add node_modules to ignore node_modues being copied).
- step 6/7: Expose port 5000, so that we can access the app outside the container.
- step 7/7: Finally run npm start to start the backend (make sure to add npm start script in package.json).