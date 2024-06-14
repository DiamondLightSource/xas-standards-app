import { Grid, TextField } from "@mui/material";

function SampleForm(props: {
  sampleName: string;
  setSampleName: React.Dispatch<React.SetStateAction<string>>;
  sampleComp: string;
  setSampleComp: React.Dispatch<React.SetStateAction<string>>;
  samplePrep: string;
  setSamplePrep: React.Dispatch<React.SetStateAction<string>>;
}) {
  const sampleName = props.sampleName;
  const setSampleName = props.setSampleName;
  const sampleComp = props.sampleComp;
  const setSampleComp = props.setSampleComp;
  const samplePrep = props.samplePrep;
  const setSamplePrep = props.setSamplePrep;

  return (
    <Grid component="fieldset" container spacing={1}>
      <legend>Sample Information</legend>
      <Grid item xs={6}>
        <TextField
        margin="dense" 
          id="sample-name"
          label="Sample Name"
          variant="outlined"
          value={sampleName}
          onChange={(e) => setSampleName(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
        margin="dense" 
          id="composition"
          label="Sample Composition"
          variant="outlined"
          value={sampleComp}
          onChange={(e) => setSampleComp(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
        margin="dense" 
          id="preparation"
          label="Sample Preparation"
          variant="outlined"
          value={samplePrep}
          onChange={(e) => setSamplePrep(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField margin="dense"  id="sampleform" label="Sample Form" variant="outlined" />
      </Grid>
    </Grid>
  );
}

export default SampleForm;
