class TodoList {
  constructor() {
    this.todos = [];
    this.getJsonTodos = this.getJsonTodos.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.del = this.del.bind(this);
  }

  getJsonTodos() {
    console.log(this);
    return JSON.stringify({
      status: 'success',
      data: this.todos,
    });
  }

  get(req, res) {
    res.write(
      JSON.stringify({
        status: 'success',
        data: this.todos,
      })
    );
    res.end();
  }

  post(req, res) {
    req.on('data', (data) => {
      const body = JSON.parse(data.toString());
      this.todos.push(body.data);

      res.write(this.getJsonTodos());
      res.end();
    });
  }
  put(req, res) {
    req.on('data', (data) => {
      const body = JSON.parse(data.toString());
      if (this.todos[body.id]) {
        this.todos[body.id] = body.data;
      }
    });

    res.write(this.getJsonTodos());
    res.end();
  }
  del(req, res) {
    req.on('data', (data) => {
      const body = JSON.parse(data.toString());
      this.todos.splice(body.id, 1);

      res.write(this.getJsonTodos());
      res.end();
    });
  }
}

export default TodoList;
