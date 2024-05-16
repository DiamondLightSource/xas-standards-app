import { useContext, FC } from "react";
import { UserContext } from "../contexts/UserContext";

import { Navigate } from "react-router-dom";

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
  const user = useContext(UserContext);

  if (user === null) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default RequireAuth;
