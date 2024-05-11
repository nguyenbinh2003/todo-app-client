import HomePage from "@/src/pages/HomePage/HomePage";
import ProjectDeltailPage from "@/src/pages/ProjectDetailPage/ProjectDeltailPage";
import DefaultLayout from "@/src/layouts/DefaultLayout";

export const routes = [
  { path: "/", component: HomePage, layout: DefaultLayout },
  { path: "/:idProject", component: HomePage, layout: DefaultLayout },
  {
    path: "/detail/:idProject",
    component: ProjectDeltailPage,
    layout: DefaultLayout,
  },
  {
    path: "/detail/:idProject/:idTodo",
    component: ProjectDeltailPage,
    layout: DefaultLayout,
  },
];
