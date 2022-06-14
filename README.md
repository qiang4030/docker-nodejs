# Dockerizing a Node.js web appp

## Catalogue

- [Dockerizing a Node.js web appp](#dockerizing-a-nodejs-web-appp)
  - [Catalogue](#catalogue)
  - [Create the Node.js app](#create-the-nodejs-app)
  - [Creating a `Dockerfile`](#creating-a-dockerfile)
  - [Create a `.dockerignore` file](#create-a-dockerignore-file)
  - [Build the image](#build-the-image)
  - [Run the image](#run-the-image)
  - [Test](#test)

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

## Create a `.dockerignore` file

Create a `.dockerignore` file in the same directory as your `Dockerfile` with following content:

```
node_modules
npm-debug.log
```

## Build the image

Navigate to the directory that has your `Dockerfile` and build the Docker image with the following command:

```sh
docker build -t <your username>/node-web-app .
```

The `-t` flag lets you tag your image so it's easier to find later using the docker images command

Your images will now be listed by Docker:

```sh
docker images

# Example
REPOSITORY                         TAG             ID             CREATED        size
<your username>/node-web-app       latest          af0f932232ef   37 hours ago   462MB
node                               16-alpine       97c7a05048e1   6 days ago     112MB
```

## Run the image

Running your image with `-d` runs the container in detached mode, leaving the container running in the background. The `-p` flag redirects a public port to a private inside the container. Run the image you priviously built:

```sh
docker run -p 3000:3000 -d <your username>/node-web-app
```

Print the output of your app:

```sh
# Get container ID
docker ps

# Print app output
docker logs <container ID>

# Example
Server is running at port 3000
```

If you need to enter the container you can use the following command:

```sh
# Enter the container
docker exec -it <container ID> /bin/bash
```

## Test

To test your app, get the ports of your app that Docker mapped:

```sh
docker ps
```

Now you can call your app using `curl`

```sh
curl -i localhost:3000

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 14
ETag: W/"e-6fka+TvjLJDUZk7rrVSWTI1DcyI"
Date: Tue, 14 Jun 2022 01:49:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Welcome to you
```

You can find more information about Docker and Node.js on Docker in the following places:

- [Official Node.js Docker Image](https://hub.docker.com/_/node/)
- [Node.js Docker Best Practices Guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
- [Official Docker documentation](https://docs.docker.com/get-started/nodejs/build-images/)
- [Docker Tag on Stack Overflow](https://stackoverflow.com/questions/tagged/docker)
- [Docker Subreddit](https://reddit.com/r/docker)
