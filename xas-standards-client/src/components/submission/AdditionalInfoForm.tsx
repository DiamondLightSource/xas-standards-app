import { Grid, TextField, Button } from "@mui/material";

import VisuallyHiddenInput from "./VisuallyHiddenInput";

function AdditionalInformationForm(props: {
  comments: string;
  setComments: (comments: string) => void;
  handleFile2: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const comments = props.comments;
  const setComments = props.setComments;

  const handleFile2 = props.handleFile2;
  return (
    <Grid component="fieldset" container spacing={1}>
      <legend>Additional Information</legend>
      <Grid item xs={6}>
        <TextField
          margin="dense"
          id="scomments"
          label="Comments"
          variant="outlined"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
        >
          Upload
          <VisuallyHiddenInput
            type="file"
            name="file1"
            onChange={handleFile2}
            multiple
          />
        </Button>
      </Grid>
    </Grid>
  );
}

export default AdditionalInformationForm;
