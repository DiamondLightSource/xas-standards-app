import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function SampleForm(props: {
  sampleName: string;
  setSampleName: (name: string) => void;
  sampleComp: string;
  setSampleComp: (composition: string) => void;
  samplePrep: string;
  setSamplePrep: (preparation: string) => void;
  sampleForm: string;
  setSampleForm: (preparation: string) => void;
  sampleFormOptions: string[];
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
        <FormControl fullWidth>
          <InputLabel margin="dense" id="sampleform">
            Sample Form
          </InputLabel>
          <Select
            name="sampleform"
            id="sampleform"
            label="Sample Form"
            value={props.sampleForm}
            onChange={(e) => props.setSampleForm(e.target.value)}
          >
            {props.sampleFormOptions.map((x, y) => (
              <MenuItem key={y} value={x}>
                {x}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default SampleForm;
