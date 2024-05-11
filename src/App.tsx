import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Container } from "react-bootstrap";

import "./App.css";
import { routes } from "./routes/routes";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
  return (
    <BrowserRouter>
      <Container style={{ width: "100%" }}>
        <Routes>
          {routes.map((route, index) => {
            const Page: any = route.component;
            let Layout: any = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
                path={route.path}
              />
            );
          })}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
