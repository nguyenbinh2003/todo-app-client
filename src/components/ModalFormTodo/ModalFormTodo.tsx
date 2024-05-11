import {
  Formik,
  Field,
  Form as FormikForm,
  FormikErrors,
  FormikTouched,
} from "formik";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import TodoServices from "@/src/services/todoServices/todoServices";
import { IFormTodo } from "@/src/interfaces/form.interface";
import { todoSchema } from "@/src/utils/formSchema";
import { handleSetContentStatus } from "@/src/utils/utils";

const TodoService = new TodoServices();

export default function ModalFormTodo(props: any) {
  const { idTodo, idProject } = useParams();
  const initialValuesDefault = {
    title: "",
    description: "",
    projectID: idProject,
    status: "",
  };
  const { isShow, handleClose, handleGetTodo, params } = props;
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<any>({});

  const handleCreateTodo: (values: object) => Promise<any> = async (
    values: object
  ) => {
    const todo: AxiosResponse<any> = await TodoService.createTodo(values);

    if (todo.status < 400) {
      handleClose();
      handleGetTodo(params);
    }
  };

  const handleUpdataTodo: (values: object) => Promise<any> = async (
    values: object
  ) => {
    const todo = await TodoService.editTodo(idTodo || "", values);

    if (todo.status < 400) {
      handleClose();
      handleGetTodo(params);
      navigate(`/detail/${idProject}`);
    }
  };

  const handleGetTodoById: (id: string) => Promise<any> = async (
    id: string
  ) => {
    const todo: AxiosResponse<any> = await TodoService.getById(id);

    if (todo.status < 400) {
      setInitialValues(todo.data);
    }
  };

  useEffect(() => {
    if (!!idTodo) {
      handleGetTodoById(idTodo);
    } else setInitialValues(initialValuesDefault);
  }, [idTodo]);

  return (
    <Modal
      show={isShow}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {idTodo ? "Update Todo" : "Create Todo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(initialValues).length > 0 ? (
          <Formik
            initialValues={initialValues}
            validationSchema={todoSchema}
            onSubmit={(values) => {
              if (!idTodo) handleCreateTodo(values);
              else handleUpdataTodo(values);
            }}
          >
            {({
              values,
              errors,
              touched,
            }: {
              values: any;
              errors: FormikErrors<IFormTodo>;
              touched: FormikTouched<IFormTodo>;
            }) => {
              return (
                <FormikForm>
                  <Row>
                    <Col md={12} className="mb-3 text-start">
                      <div className="mb-2">
                        <Form.Label className="">Name Todo</Form.Label>
                        <Field
                          as={Form.Control}
                          defaultValue={values.title}
                          className={
                            errors.title && touched.title
                              ? "form-control is-invalid"
                              : ""
                          }
                          name="title"
                        />
                        {errors.title && touched.title && (
                          <div id="" className="invalid-feedback">
                            {errors.title}
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <Form.Label className="">Description</Form.Label>
                        <Field
                          as={Form.Control}
                          name="description"
                          defaultValue={values.description}
                        />
                      </div>
                      <div>
                        <Form.Label className="">Status</Form.Label>
                        <Field
                          as={Form.Select}
                          name="status"
                          defaultValue={handleSetContentStatus(values.status)}
                        >
                          <option>Select Status</option>
                          <option value={0}>New</option>
                          <option value={1}>In Progress</option>
                          <option value={2}>Completed</option>
                        </Field>
                      </div>
                    </Col>
                    <Col md={12} className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          handleClose();
                          navigate(`/detail/${idProject}`);
                        }}
                      >
                        Close
                      </Button>
                      <Button type="submit" variant="primary" className="">
                        {idTodo ? "Save" : "Add"}
                      </Button>
                    </Col>
                  </Row>
                </FormikForm>
              );
            }}
          </Formik>
        ) : (
          ""
        )}
      </Modal.Body>
    </Modal>
  );
}
