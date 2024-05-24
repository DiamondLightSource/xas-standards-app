import { Select, Grid } from "@mui/material";

function ElementForm(props) {
  const elementId = props.elementId;
  const setElementID = props.setElementId;
  const edgeId = props.edgeId;
  const setEdgeID = props.setEdgeId;
  const elements = props.elements;
  const edges = props.edges;

  return (
    <Grid component="fieldset" container>
      <legend>XAS Measurement</legend>
      <Grid item xs={6}>
        <label htmlFor="element">Element</label>
      </Grid>
      <Grid item xs={6}>
        <Select
          name="element"
          id="element"
          value={elementId}
          onChange={(e) => setElementID(e.target.value)}
        >
          {elements.map((x, y) => (
            <option key={y} value={x.z}>
              {x.symbol}
            </option>
          ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
        <label htmlFor="edge">Edge</label>
      </Grid>
      <Grid item xs={6}>
        <Select
          name="edge"
          id="edge"
          onChange={(e) => setEdgeID(e.target.value)}
          value={edgeId}
        >
          {edges.map((x, y) => (
            <option key={y} value={x.id}>
              {x.name}
            </option>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
}

export default ElementForm;
