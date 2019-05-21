# Audius Hedgehog Demo
Client and server demo for Audius Hedgehog written using React, node.js, Express and Postgres. The [client](/client) folder contains a simple authentication app written in React using Hedgehog. The [server](/server) folder demonstrates the database structure and server endpoints to persist information while using the Hedgehog module.

### Running the Demo
To run, make sure you have Docker installed, clone the repo and run `docker-compose up`. Once the server has started, visit `http://localhost:8000`

<b>**Note</b> If you're running the demo on windows or linux, you may need to change the `dbUrl` property in `server/default-config.json`. Docker for Mac needs special networking so the host is set to `docker.for.mac.localhost`. https://docs.docker.com/v17.09/docker-for-mac/networking/



## Demo with Firebase backend
The following example shows using the Hedgehog module with a Firebase backend hosted on [CodeSandbox](https://codesandbox.io/embed/pp9zzv2n00)