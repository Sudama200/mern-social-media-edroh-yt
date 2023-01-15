import React, { Suspense } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import DashBoardLayout from "../../components/DashBoardLayout";

/**
 * You can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component.
 */
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

const Authmiddleware = ({ component: Component }) => {
  return (
    <Routes>
      <Route
        render={(props) => {
          // here you can apply condition
          if (!localStorage.getItem("authorization")) {
            return (
              <Suspense fallback={"null"}>
                <Navigate to={{ pathname: "/" }} />
              </Suspense>
            );
          }

// import DashboardLayout from "../../components/DashboardLayout";
          return (
            // <Layout>
            <DashBoardLayout>
              <Suspense fallback={"null"}>
                <Component {...props} />
              </Suspense>
            </DashBoardLayout>
            // </Layout>
          );
        }}
      />
    </Routes>
  );
};

export default withRouter(Authmiddleware);
