const http = require('http');
const TodoList = require("./todolist");
const PORT = process.env.PORT || 3000;

const service = new TodoList();
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    if (req.method == "GET") {
      service.getTodoList(req, res);
    }
    if (req.method == "POST") {
      service.postTodoList(req, res);
    }
    if (req.method == "PUT") {
      service.putTodoList(req, res);
    }
    if (req.method == "DELETE") {
      service.deleteTodoList(req, res);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});