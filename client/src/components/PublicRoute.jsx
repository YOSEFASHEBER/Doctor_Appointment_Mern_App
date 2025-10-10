import { Navigate } from "react-router-dom";

function PublicRoute(props) {
  if (!localStorage.getItem("token")) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}

export default PublicRoute;
