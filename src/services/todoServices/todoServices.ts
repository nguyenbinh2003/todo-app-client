import BaseServices from "../baseService";

const URL = "https://todo-app-sever.onrender.com";

class TodoServices extends BaseServices {
  constructor() {
    super(URL, {});
  }
  // get
  getTodo(params: object) {
    return this.get(`/todos`, {
      params,
    });
  }
  getById(id: string) {
    return this.get(`/todos/${id}`, {});
  }

  // post
  createTodo(data: object) {
    return this.post("todos/add", data);
  }

  // patch
  editTodo(id: string, data: object) {
    return this.patch(`/todos/${id}`, data);
  }

  // delete
  deleteTodo(id: string) {
    return this.delete(`/todos/${id}`);
  }
}

export default TodoServices;
