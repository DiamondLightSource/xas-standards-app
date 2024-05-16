import { Link } from "react-router-dom";

function LogInPage() {
  return (
    <Link to="/login" reloadDocument={true}>
      Log In
    </Link>
  );
}

export default LogInPage;
