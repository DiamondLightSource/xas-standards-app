import axios from "axios";
import { useState } from "react";

import { Grid, TextField, Button, Typography } from "@mui/material";

const crossref_url = "https://api.crossref.org/works/";
const mailto = "?mailto=dataanalysis@diamond.ac.uk";

function CitationForm(props: {
  citation: string;
  setCitation: (citation: string) => void;
  doi: string;
  setDOI: (doi: string) => void;
}) {
  const citation = props.citation;
  const setCitation = props.setCitation;
  const doi = props.doi;
  const setDOI = props.setDOI;

  const [isValidDOI, setValidDOI] = useState(false);

  const validateDOI = () => {
    // prettier-ignore
    const doi_regex = "^10.\\d{4,9}\\/[-._;()\\/:A-Z0-9]+$"; // eslint-disable-line
    const matches = new RegExp(doi_regex).test(doi);

    const full_url = encodeURI(crossref_url + doi + "/" + mailto);

    if (matches) {
      axios
        .get(full_url)
        .then(() => {
          setValidDOI(true);
        })
        .catch(() => {
          setValidDOI(false);
        });
    }
  };

  return (
    <Grid component="fieldset" container spacing={1}>
      <legend>Reference</legend>
      <Grid item xs={6}>
        <TextField
          id="citation"
          label="Citation"
          variant="outlined"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="doi"
          label="DOI"
          variant="outlined"
          value={doi}
          onChange={(e) => setDOI(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button onClick={validateDOI}>Validate DOI</Button>
      </Grid>
      <Grid item xs={6}>
        <Typography>{isValidDOI ? "Valid DOI" : "Invalid DOI"}</Typography>
      </Grid>
    </Grid>
  );
}

export default CitationForm;
