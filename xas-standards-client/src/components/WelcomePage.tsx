import { Link } from "react-router-dom";

import { Container, Typography, Box } from "@mui/material";

function WelcomePage() {
  return (
    <Container maxWidth="md" sx={{ alignSelf: "center" }}>
      <Typography variant="h5">
        Welcome to the XAS Standards Database!
      </Typography>
      <Box>
        <Typography paragraph={true}>
          The XAS Standards Database is a collection of XAS data from careful
          measurement "standard" materials - think pure chemicals purchased from
          suppliers or well characterised mineral samples.
        </Typography>
        <Typography paragraph={true}>
          The database is open to <Link to={"view"}> search and download </Link>
          data from. <Link to={"submit"}> Submissions </Link>
          can be made by anyone with a valid Diamond Light Source CAS login.
        </Typography>
      </Box>
    </Container>
  );
}

export default WelcomePage;
