import { JSX, useState, useEffect } from "react";
import { XASStandard } from "../models";
import StandardMetadataTable from "./StandardMetadataTable";
import axios from "axios";

import Stack from "@mui/material/Stack";

import { Element } from "../models";

import ElementSelector from "./ElementSelectorMui";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const standards_url = "/api/standards";

const nResults = 7;

function StandardMetadata(props: {
  key: number;
  xasstandard: XASStandard | null;
  selected: XASStandard | undefined;
  updatePlot: React.Dispatch<XASStandard>;
}): JSX.Element {
  const className = props.xasstandard === props.selected ? "activeclicked" : "";

  return (
    <StyledTableRow
      onClick={() => props.updatePlot(props.xasstandard!)}
      key={props.key}
      className={className}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell align="right">
        {props.xasstandard?.element.symbol ?? "\xa0"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.xasstandard?.edge.name ?? ""}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.xasstandard?.sample_name ?? ""}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.xasstandard?.sample_prep ?? ""}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.xasstandard?.beamline.name ?? ""}
      </StyledTableCell>
    </StyledTableRow>
  );
}

function StandardsTable(props: {
  standards: XASStandard[];
  elements: Element[];
  setStandards: React.Dispatch<XASStandard[]>;
  updatePlot: React.Dispatch<number>;
}): JSX.Element {
  const [selectedStandard, setSelectedStandard] = useState<XASStandard>();
  const [prevNext, setPrevNext] = useState<string[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<number>(0);

  const setStandards = props.setStandards;
  const elements = props.elements;

  const clickStandard = (standard: XASStandard) => {
    props.updatePlot(standard.id);
    setSelectedStandard(standard);
  };

  const nextPage = () => {
    setCurrent(prevNext[1]);
  };

  const prevPage = () => {
    setCurrent(prevNext[0]);
  };

  useEffect(() => {
    const get_req = (z: number, cursor: string | null) => {
      let url = standards_url;

      let symbol = null;

      if (z > 0) {
        symbol = elements[z - 1].symbol;
      }

      if (symbol != null) {
        url =
          standards_url + "?element=" + symbol + "&size=" + String(nResults);
      } else {
        url = url + "?size=" + String(nResults);
      }

      if (cursor) {
        url = url + "&cursor=" + cursor;
      }

      axios.get(url).then((response) => {
        const output: XASStandard[] = response.data.items as XASStandard[];
        setPrevNext([response.data.previous_page, response.data.next_page]);
        setStandards(output);
      });
    };
    get_req(selectedElement, current);
  }, [selectedElement, current, setStandards, elements]);

  const stds: (XASStandard | null)[] = [...props.standards];

  if (props.standards.length < nResults) {
    while (stds.length < nResults) {
      stds.push(null);
    }
  }

  return (
    <Stack spacing={2}>
      <ElementSelector
        elements={elements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Element</TableCell>
              <TableCell align="right">Edge</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Prep</TableCell>
              <TableCell align="right">Beamline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stds.map((standard, key) =>
              StandardMetadata({
                key: key,
                xasstandard: standard,
                selected: selectedStandard,
                updatePlot: clickStandard,
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          disabled={prevNext == null || prevNext[0] == null}
          onClick={prevPage}
        >
          &lt;
        </Button>
        <Button
          variant="contained"
          disabled={prevNext == null || prevNext[1] == null}
          onClick={nextPage}
        >
          &gt;
        </Button>
      </Stack>
      <StandardMetadataTable standard={selectedStandard} />
    </Stack>
  );
}

export default StandardsTable;
