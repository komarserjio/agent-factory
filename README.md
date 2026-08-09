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
