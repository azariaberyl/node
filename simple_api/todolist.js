class TodoList {
  todoList = ["Hello", "World"];

  getJsonTodoList() {
    const json = JSON.stringify({
      code: 200,
      status: "OK",
      data: this.todoList.map((val, i) => {
        return {
          id: i,
          todo: val
        }
      })
    })
    return json;
  }

  getTodoList(req, res) {
    res.write(this.getJsonTodoList());
    res.end();
  }

  postTodoList(req, res) {
    req.addListener("data", (data) => {
      const body = JSON.parse(data.toString())
      this.todoList.push(body.todo)

      res.write(this.getJsonTodoList());
      res.end();
    })
  }

  putTodoList(req, res) {
    req.addListener("data", (data) => {
      const body = JSON.parse(data.toString())
      if (this.todoList[body.id]) {
        this.todoList[body.id] = body.todo;
      }

      res.write(this.getJsonTodoList());
      res.end()
    })
  }

  deleteTodoList(req, res) {
    req.addListener("data", (data) => {
      const body = JSON.parse(data.toString())
      if (this.todoList[body.id]) {
        this.todoList.splice(body.id, 1);
      }

      res.write(this.getJsonTodoList());
      res.end()
    })
  }
}

module.exports = TodoList;