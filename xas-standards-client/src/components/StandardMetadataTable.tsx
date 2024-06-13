import { XASStandard } from "../models";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { styled } from "@mui/material/styles";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const data_url = "/api/data";

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

function StandardMetadataTable(props: { standard: XASStandard | undefined }) {
  const standard = props.standard;

  if (!standard) {
    return <div></div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>Sample Name</StyledTableCell>
            <StyledTableCell> {standard.sample_name} </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Sample Prep</StyledTableCell>
            <StyledTableCell>{standard.sample_prep}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Sample Comp</StyledTableCell>
            <StyledTableCell> {standard.sample_comp}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>DOI</StyledTableCell>
            <StyledTableCell> {standard.doi}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Citation</StyledTableCell>
            <StyledTableCell> {standard.citation} </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Beamline</StyledTableCell>
            <StyledTableCell> {standard.beamline.name} </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Facility</StyledTableCell>
            <StyledTableCell>{standard.beamline.facility.name}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Collection Date</StyledTableCell>
            <StyledTableCell> {standard.collection_date}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>Download</StyledTableCell>
            <StyledTableCell>
              <a
                href={data_url + "/" + String(standard.id) + "?format=xdi"}
                download={String(standard.id) + ".xdi"}
              >
                link
              </a>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StandardMetadataTable;
