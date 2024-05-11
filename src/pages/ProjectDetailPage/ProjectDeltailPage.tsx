import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import TodoServices from "@/src/services/todoServices/todoServices";
import { handleFormatDate, handleSetContentStatus } from "@/src/utils/utils";
import ModalFormTodo from "@/src/components/ModalFormTodo/ModalFormTodo";

const TodoService = new TodoServices();

export default function ProjectDeltailPage() {
  const { idProject } = useParams();
  const navigate = useNavigate();
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [sort, setSort] = useState<string>("");

  const params = { title: "", sortDirection: sort, projectID: idProject };

  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [todolist, setTodolist] = useState([]);

  const handleOnShow = () => setIsShowModal(true);
  const handleClose = () => setIsShowModal(false);

  const handleGetTodo = async (params: object) => {
    const todolist = await TodoService.getTodo(params);

    if (todolist.status < 400) {
      setTodolist(todolist.data);
    }
  };

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }

    timeRef.current = setTimeout(() => {
      handleGetTodo({ ...params, title: value });
    }, 1000);
  }, []);

  const handleDeleteTodo = async (id: string) => {
    const todo = await TodoService.deleteTodo(id);

    if (todo.status < 400) {
      handleGetTodo(params);
    }
  };
  useEffect(() => {
    handleGetTodo(params);
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
        <Row className="d-flex">
          <Col md={7} className="p-0">
            <input
              type="text"
              onChange={(e) => handleSearch(e)}
              className="form-control"
              placeholder="Search..."
              style={{ maxHeight: "50px" }}
            />
          </Col>
          <Col md={5} className="p-0">
            <Button onClick={handleOnShow}>Add Todo</Button>
          </Col>
        </Row>
      </div>

      <div>
        <Table striped bordered={false}>
          <thead>
            <tr>
              <th style={{ width: "130px" }}>Title</th>
              <th style={{ width: "200px" }}>Description</th>
              <th style={{ width: "120px" }}>
                Update At
                <button
                  className="p-0 ms-1 border-0"
                  style={{ background: "transparent" }}
                  onClick={() => {
                    setSort(sort === "" ? "asc" : "");
                    handleGetTodo(params);
                  }}
                >
                  {sort === "asc" ? (
                    <FaChevronUp size={12} color="black" />
                  ) : (
                    <FaChevronDown size={12} color="black" />
                  )}
                </button>
              </th>
              <th style={{ width: "100px" }}>Status</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {todolist
              ? todolist.map((item: any, index: number) => {
                  return (
                    <tr className="" key={index}>
                      <th>{item.title}</th>
                      <th>{item.description}</th>
                      <th>{handleFormatDate(new Date(item.updatedAt))}</th>
                      <th>{handleSetContentStatus(item.status)}</th>
                      <th>
                        <Dropdown>
                          <Dropdown.Toggle
                            style={{ paddingTop: "3px", paddingBlock: "0" }}
                            split
                            variant="secondary"
                            id="dropdown-basic"
                          ></Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                navigate(`/detail/${idProject}/${item._id}`);
                                handleOnShow();
                              }}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDeleteTodo(item._id)}
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </th>
                    </tr>
                  );
                })
              : ""}
          </tbody>
        </Table>
      </div>
      <ModalFormTodo
        todolist={todolist}
        isShow={isShowModal}
        handleClose={handleClose}
        handleGetTodo={handleGetTodo}
        params={params}
      />
    </div>
  );
}
