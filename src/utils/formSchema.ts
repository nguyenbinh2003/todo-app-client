import * as Yup from "yup";

export const projectSchema = Yup.object().shape({
  title: Yup.string().required("Title is required !"),
  description: Yup.string(),
});

export const todoSchema = Yup.object().shape({
  title: Yup.string().required("Title is required !"),
  description: Yup.string(),
  status: Yup.number(),
  projectID: Yup.string().required(),
});
