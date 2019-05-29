<p align="center">
  <img src="https://user-images.githubusercontent.com/2731362/58195666-5cba9a00-7c7d-11e9-8409-5aa34b780ea2.png" width="240" />
</p>

<br />

# Audius Hedgehog Demo
Client and server demo for [Audius Hedgehog](https://github.com/AudiusProject/audius-hedgehog) written using React, node.js, Express and Postgres.

For documentation, please read the [Hedgehog docs](https://audius-project.github.io/hedgehog-docs).

## Demo with a Firebase backend 🌐

The [client-firebase](/client-firebase) folder contains a simple authentication app written in React using Hedgehog that connects to a Firebase backend.

A deployment of the client code against a Firebase backend can be found on [CodeSandbox](https://codesandbox.io/embed/pp9zzv2n00).

## Demo with a local backend 💻

The [client](/client) folder contains a simple authentication app written in React using Hedgehog (largely identical to /client-firebase).

The [server](/server) folder demonstrates the database structure and server endpoints to persist information while using the Hedgehog module.

To run, make sure you have Docker installed.

```
docker-compose up
```

Once the server has started, visit `http://localhost:8000`


To make changes to /client or /server, run

```
docker-compose up --build
```

**NOTE**: If you're running the demo on windows or linux, you may need to change the `dbUrl` property in `server/default-config.json`. Docker for Mac needs special networking so the host is set to `docker.for.mac.localhost`. https://docs.docker.com/v17.09/docker-for-mac/networking/
