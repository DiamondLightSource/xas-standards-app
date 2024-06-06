import { Select, Box, MenuItem, FormControl, InputLabel, Stack } from "@mui/material";

import { Element, Edge } from "../models";

function ElementForm(props: {
  elementId: number;
  setElementId: React.Dispatch<React.SetStateAction<number>>;
  edgeId: number;
  setEdgeId: React.Dispatch<React.SetStateAction<number>>;
  elements: Element[];
  edges: Edge[];
}) {
  const elementId = props.elementId;
  const setElementID = props.setElementId;
  const edgeId = props.edgeId;
  const setEdgeID = props.setEdgeId;
  const elements = props.elements;
  const edges = props.edges;

  return (
    <Box component="fieldset">
      <legend>XAS Measurement</legend>
      <Stack spacing={2}>
        <FormControl>
          <InputLabel id="Element">Element</InputLabel>
          <Select
          sx={{ minWidth: 100 }}
            name="Element"
            id="Element"
            label="Element"
            value={elementId}
            onChange={(e) => setElementID(e.target.value as number)}
          >
            {elements.map((x, y) => (
              <MenuItem key={y} value={x.z}>
                {x.symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="Edge">Edge</InputLabel>
          <Select
          sx={{ minWidth: 100 }}
            name="Edge"
            id="Edge"
            label="Edge"
            onChange={(e) => setEdgeID(e.target.value as number)}
            value={edgeId}
          >
            {edges.map((x, y) => (
              <MenuItem key={y} value={x.id}>
                {x.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Stack>
    </Box>
  );
}

export default ElementForm;
