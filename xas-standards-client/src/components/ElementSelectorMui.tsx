// import "./ElementSelector.css";
import React, { useRef, useState } from "react";
import { usePopper } from "react-popper";
import SimplePeriodicTable from "./PeriodicTable";
import { Element } from "../models";

import { Button, Typography } from "@mui/material";
import { Popover } from "@mui/material";
import { Stack } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";

function ElementSelector(props: {
  elements: Element[];
  selectedElement: number;
  setSelectedElement: React.Dispatch<number>;
}) {
  const elements = props.elements;
  const [pop, setPop] = useState(false);
  const boxRef = useRef();
  const tooltipRef = useRef();
  const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    props.setSelectedElement(Number(event.target.value));
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    // <div className="elementselector">
    <Stack direction="row" spacing={2}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={String(props.selectedElement)}
        label="Element"
        onChange={handleChange}
      >
        <MenuItem value={0}>All Elements</MenuItem>
        {elements.map((x, y) => (
          <MenuItem key={y} value={x.z}>
            {x.symbol}
          </MenuItem>
        ))}
      </Select>
      <Button
        aria-describedby={id}
        variant="outlined"
        sx={{ textTransform: "none" }}
        onClick={handleClick}
      >
        Periodic Table
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SimplePeriodicTable
          onClickElement={(el) => {
            props.setSelectedElement(el);
            setPop(false);
          }}
          elementSize={55}
        />
      </Popover>
    </Stack>
  );
}

export default ElementSelector;
