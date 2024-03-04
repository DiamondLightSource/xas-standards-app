import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div>
      <h2>Welcome to the XAS Standards Database!</h2>
      <div>
        <p>
          The XAS Standards Database is a collection of XAS data from careful
          measurement "standard" materials - think pure chemicals purchased from
          suppliers or well characterised mineral samples.
        </p>
        <p>
          The database is open to <Link to={"view"}> search and download </Link>
          data from. <Link to={"submit"}> Submissions </Link>
          can be made by anyone with a valid Diamond Light Source CAS login.
        </p>
      </div>
    </div>
  );
}

export default WelcomePage;
