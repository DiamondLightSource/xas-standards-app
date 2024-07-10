import { Grid, TextField, Button } from "@mui/material";

import VisuallyHiddenInput from "./VisuallyHiddenInput";

function AdditionalInformationForm(props: {
  comments: string;
  setComments: (comments: string) => void;
}) {
  const comments = props.comments;
  const setComments = props.setComments;

  return (
    <Grid component="fieldset" container spacing={1}>
      <legend>Additional Information</legend>
      <Grid item xs={true}>
        <TextField
          margin="dense"
          id="scomments"
          label="Comments"
          variant="outlined"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Grid>
    </Grid>
  );
}

export default AdditionalInformationForm;
