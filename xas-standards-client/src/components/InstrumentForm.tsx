import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";

import { Beamline } from "../models";

function InstrumentForm(props : {
  beamlines : Beamline[]
  beamlineHeader: string;
  beamlineId: number;
  setBeamlineId: React.Dispatch<React.SetStateAction<number>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}) {
  const beamlines = props.beamlines;
  const beamlineHeader = props.beamlineHeader;
  const setBeamlineId = props.setBeamlineId;
  const beamlineId = props.beamlineId;
  const date = props.date;
  const setDate = props.setDate;

  return (
    <Grid component="fieldset" container spacing={1} justifyContent={"flex-start"}>
      <legend>Instrument</legend>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel margin="dense" id="beamline">Beamline</InputLabel>
          <Select
            name="beamline"
            id="beamline"
            label="Beamline"
            value={beamlineId}
            onChange={(e) => setBeamlineId(e.target.value as number)}
          >
            {beamlines.map((x, y) => (
              <MenuItem key={y} value={x.id}>
                {x.name + " " + x.facility.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
      <FormControl fullWidth>
      <TextField
      InputLabelProps={{ shrink: true }} 
      margin="dense" 
        type="datetime-local"
        id="date"
        value={date}
        label="Date Measured"
        variant="outlined"
        onChange={(e) => setDate(e.target.value)}
      />
      </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Typography>Beamline from Header: {beamlineHeader}</Typography>
      </Grid>
    </Grid>
  );
}

export default InstrumentForm;
