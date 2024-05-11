import BaseServices from "../baseService";

const URL = "https://todo-app-sever.onrender.com";

class ProjectServices extends BaseServices {
  constructor() {
    super(URL, {});
  }

  // get
  getProject(id?: string) {
    return this.get(`/projects/${id || ""}`);
  }

  // post
  createProject(data: object) {
    return this.post("projects/add", data);
  }

  // patch
  editProject(id: string, data: object) {
    return this.patch(`/projects/${id}`, data);
  }

  // delete
  deleteProject(id: string) {
    return this.delete(`/projects/${id}`);
  }
}

export default ProjectServices;
