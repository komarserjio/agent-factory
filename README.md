# Node.js TypeScript Hello World

A minimal HTTP server that returns JSON responses.

## Usage

```sh
npm install
npm run build
npm start
```

The server listens on port `3000` by default. Set `PORT` to use another port:

```sh
PORT=8080 npm start
```

`GET /` returns a JSON welcome message. Other paths return a JSON `404` response.

## Docker

Build the production image from the repository root:

```sh
docker build -t node-typescript-hello-world:local .
```

Run it with the default port:

```sh
docker run --rm -p 3000:3000 node-typescript-hello-world:local
```

Set `PORT` to use a different port inside the container:

```sh
docker run --rm -e PORT=8080 -p 8080:8080 node-typescript-hello-world:local
```
