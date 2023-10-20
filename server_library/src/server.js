import http from "http"

export default class Server {
  constructor({ port, get, post, put, del }) {
    this.port = port || 3000;
    this.get = get;
    this.post = post;
    this.put = put;
    this.del = del;
  }

  start() {
    const server = http.createServer((req, res) => {
      if (req.method == "GET") {
        this.get(req, res);
      }
      if (req.method == "POST") {
        this.post(req, res);
      }
      if (req.method == "PUT") {
        this.put(req, res);
      }
      if (req.method == "DELETE") {
        this.del(req, res);
      }
    })
    server.listen(this.port, () => {
      console.log(`Server is on http://localhost:${this.port}`);
    })
  }
}