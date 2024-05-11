import { Button, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import ProjectServices from "@/src/services/projectServices/projectServices";
import ModalFormProject from "@/src/components/ModalFormProject/ModalFormProject";
import { handleFormatDate } from "@/src/utils/utils";

const ProjectService = new ProjectServices();

interface IProject {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<IProject[] | []>([]);

  const handleOnShow = () => setIsShowModal(true);
  const handleClose = () => setIsShowModal(false);

  const handleGetProject = async () => {
    const projects: AxiosResponse<any> = await ProjectService.getProject();

    if (projects.data) {
      const projectList = projects.data.map((item: any) => {
        return {
          id: item._id,
          title: item.title,
          description: item.description,
          updatedAt: item.updatedAt,
        };
      });
      setProjects(projectList);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const project: AxiosResponse<any> = await ProjectService.deleteProject(id);
    if (project.status < 400) {
      handleGetProject();
    }
  };
  useEffect(() => {
    handleGetProject();
  }, []);

  return (
    <div
      style={{
        minWidth: "400px",
        maxWidth: "860px",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div
        className="mb-3 d-flex justify-content-between"
        style={{
          position: "fixed",
          top: "20%",
          left: "24%",
          minWidth: "800px",
        }}
      >
        <h4 className="text-start">Todo App</h4>
        <Button onClick={handleOnShow}>Add Project</Button>
      </div>
      <div className="d-flex gap-2" style={{}}>
        {projects
          ? projects.map((item: any, index: number) => {
              const date = new Date(item.updatedAt);
              return (
                <Card style={{ width: "180px", maxWidth: "auto" }} key={index}>
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Text>{handleFormatDate(date)}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex flex-column gap-1">
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigate(`/detail/${item.id}`);
                      }}
                    >
                      Detail
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigate(`/${item.id}`);
                        setIsShowModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteProject(item.id)}
                    >
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              );
            })
          : ""}
      </div>
      <ModalFormProject
        isShow={isShowModal}
        handleClose={handleClose}
        handleGetProject={handleGetProject}
      />
    </div>
  );
}
