import { useState, useContext } from "react";

import { MetadataContext } from "../../contexts/MetadataContext";

import axios from "axios";
import { AxiosResponse, AxiosError } from "axios";

import XDIFile from "../../xdifile";

import ElementForm from "./ElementForm";
import SampleForm from "./SampleForm";
import InstrumentForm from "./InstrumentForm";
import CitationForm from "./CitationForm";
import AdditionalInformationForm from "./AdditionalInfoForm";
import { useNavigate } from "react-router-dom";

import VisuallyHiddenInput from "./VisuallyHiddenInput";

import {
  Box,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const standards_url = "/api/standards";

function StandardSubmission() {
  const { elements, edges, beamlines, licences } = useContext(MetadataContext);

  const [file, setFile] = useState<File>();
  const [file2, setFile2] = useState<FileList>();

  const [elementId, setElementId] = useState(1);
  const [edgeId, setEdgeId] = useState(1);
  const [sampleName, setSampleName] = useState("");
  const [sampleComp, setSampleComp] = useState("");
  const [samplePrep, setSamplePrep] = useState("");
  const [beamlineId, setBeamlineId] = useState(1);
  const [beamlineHeader, setBeamlineHeader] = useState("");
  const [doi, setDOI] = useState("");
  const [date, setDate] = useState("");
  const [licence, setLicence] = useState(licences[0]);
  const [citation, setCitation] = useState("");
  const [comments, setComments] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //build form data by hand to get correct
    //serialisation of addition_files
    //so it is not called additional_files[]
    const form = new FormData();

    if (!file) {
      throw Error("File not defined");
    }

    form.append("xdi_file", file);
    form.append("element_id", elementId.toString());
    form.append("edge_id", edgeId.toString());
    //BEAMLINE
    form.append("beamline_id", beamlineId.toString());
    form.append("sample_name", sampleName);
    form.append("sample_comp", sampleComp);
    form.append("sample_prep", samplePrep);
    form.append("doi", doi);
    form.append("citation", citation);
    form.append("comments", comments);
    form.append("date", date);
    //LICENCE
    form.append("licence", licence);

    if (file2 != null) {
      for (let i = 0; i < file2.length; i++) {
        form.append("additional_files", file2[i]);
      }
    }

    axios
      .post(standards_url, form)
      .then((response: AxiosResponse) => {
        console.log(response);
        window.alert("Thank you for your submission");
        navigate("/view");
      })
      .catch((reason: AxiosError) => {
        window.alert(reason.message);
      });
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const fileReader = new FileReader();

      fileReader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target != null && typeof e.target.result === "string") {
          let xdifile: XDIFile;
          try {
            xdifile = XDIFile.parseFile(e.target.result);
          } catch (error) {
            let message = "Unknown Error";
            if (error instanceof Error) {
              message = error.message;
            }
            window.alert("Invalid file: " + message);
            const resetForm: HTMLFormElement = document.getElementById(
              "submissionform"
            ) as HTMLFormElement;
            if (resetForm) {
              resetForm.reset();
            }

            return;
          }

          const el = elements.find((e) => e.symbol === xdifile.element);
          const ed = edges.find((e) => e.name === xdifile.edge);

          setElementId(el?.z ?? elementId);
          setEdgeId(ed?.id ?? edgeId);
          setSampleName(xdifile.sample?.name ?? sampleName);
          setSampleComp(xdifile.sample?.stoichiometry ?? sampleComp);
          setSamplePrep(xdifile.sample?.prep ?? samplePrep);
          setDate(xdifile.date ?? date);
          setBeamlineHeader(xdifile.beamline ?? beamlineHeader);
          setComments(xdifile.comments ?? comments);
        }
      };

      fileReader.readAsText(event.target.files[0]);

      setFile(event.target.files[0]);
    }
  };

  const handleFile2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setFile2(event.target.files);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5">Upload A Standard XDI file</Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="centre"
        component="form"
        className="submissionpage"
        id="submissionform"
        onSubmit={handleSubmit}
        sx={{ width: 1 / 2 }}
        gap={5}
      >
        <Box component="fieldset">
          <legend>XDI File</legend>
          <Button
            variant="contained"
            type="submit"
            role={undefined}
            tabIndex={-1}
            component="label"
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              name="file1"
              onChange={handleFile}
            />
          </Button>
          <Typography>
            Submitted file must be in xdi format and contain an energy column,
            and either "mu" datasets or "i" datasets with corresponding i0.
            Inclusion of Reference datasets (murefer or irefer with i0) is
            mandatory.
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={6}>
            <ElementForm
              elementId={elementId}
              setElementId={setElementId}
              edgeId={edgeId}
              setEdgeId={setEdgeId}
              elements={elements}
              edges={edges}
            />
          </Grid>
          <Grid item xs={6}>
            <SampleForm
              sampleName={sampleName}
              setSampleName={setSampleName}
              sampleComp={sampleComp}
              setSampleComp={setSampleComp}
              samplePrep={samplePrep}
              setSamplePrep={setSamplePrep}
            />
          </Grid>
          <Grid item xs={6}>
            <InstrumentForm
              beamlines={beamlines}
              beamlineHeader={beamlineHeader}
              setBeamlineId={setBeamlineId}
              beamlineId={beamlineId}
              date={date}
              setDate={setDate}
            />
          </Grid>
          <Grid item xs={6}>
            <CitationForm
              citation={citation}
              setCitation={setCitation}
              doi={doi}
              setDOI={setDOI}
            />
          </Grid>
        </Grid>
        <AdditionalInformationForm
          comments={comments}
          setComments={setComments}
          handleFile2={handleFile2}
        />
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel margin="dense" id="licence">
              Licence
            </InputLabel>
            <Select
              name="licence"
              id="licence"
              label="Licence"
              value={licence}
              onChange={(e) => setLicence(e.target.value)}
            >
              {licences.map((x, y) => (
                <MenuItem key={y} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid item xs={6}>
            <FormControlLabel
              required
              control={<Checkbox />}
              label="By ticking I confirm info is correct and I grant permission for
            diamond to publish data under selected licence"
            />
          </Grid>
        </Grid>

        <Button type="submit">Submit</Button>
      </Box>
    </Box>
  );
}

export default StandardSubmission;
