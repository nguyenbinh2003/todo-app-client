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

import ProjectServices from "@/src/services/projectServices/projectServices";
import { IFormProject } from "@/src/interfaces/form.interface";
import { projectSchema } from "@/src/utils/formSchema";

const ProjectService = new ProjectServices();

const initialValuesDefault = { title: "", description: "" };
const desiredKeys = ["title", "description"];

function filterObjectByKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((filteredObj, key) => {
    if (obj.hasOwnProperty(key)) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {} as Pick<T, K>);
}

export default function ModalFormProject(props: any) {
  const { idProject } = useParams();
  const navigate = useNavigate();
  const { isShow, handleClose, handleGetProject } = props;
  const [initialValues, setInitialValues] = useState<any>({});

  const handleGetProjectById = async (id: string) => {
    const project = await ProjectService.getProject(id);
    if (project.status < 400) {
      const filterProject = filterObjectByKeys(project.data, desiredKeys);

      setInitialValues(filterProject);
    }
  };

  const handleCreateProject = async (values: object) => {
    const project = await ProjectService.createProject(values);

    if (project.status < 400) {
      handleGetProject();
      handleClose();
    }
  };
  const handleUpdateProject = async (id: string, values: object) => {
    const project: AxiosResponse<any> = await ProjectService.editProject(
      id,
      values
    );

    if (project.status < 400) {
      handleGetProject();
      handleClose();
      navigate("/");
    }
  };

  useEffect(() => {
    if (!!idProject) handleGetProjectById(idProject);
    else setInitialValues(initialValuesDefault);
  }, [idProject]);
  return (
    <Modal
      show={isShow}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {idProject ? "Update Project" : "Create Project"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(initialValues).length > 0 ? (
          <Formik
            initialValues={initialValues}
            validationSchema={projectSchema}
            onSubmit={(values) => {
              if (!!idProject) handleUpdateProject(idProject, values);
              else handleCreateProject(values);
            }}
          >
            {({
              values,
              errors,
              touched,
            }: {
              values: any;
              errors: FormikErrors<IFormProject>;
              touched: FormikTouched<IFormProject>;
            }) => {
              console.log(values);

              return (
                <FormikForm>
                  <Row>
                    <Col md={12} className="mb-3 text-start">
                      <div className="mb-2">
                        <Form.Label className="">Name Project</Form.Label>
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
                      <div>
                        <Form.Label className="">Description</Form.Label>
                        <Field
                          as={Form.Control}
                          name="description"
                          defaultValue={values.description}
                        />
                      </div>
                    </Col>
                    <Col md={12} className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          handleClose();
                          if (idProject) {
                            navigate("/");
                          }
                        }}
                      >
                        Close
                      </Button>
                      <Button type="submit" variant="primary" className="">
                        {idProject ? "Save" : "Add"}
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
