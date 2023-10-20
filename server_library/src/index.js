import Server from './server.js';
import TodoList from './todolist.js';

const service = new TodoList();
service.getJsonTodos();

const app = new Server({
  port: 8000,
  get: service.get,
  post: service.post,
  put: service.put,
  del: service.del,
});

console.log(app);

app.start();
