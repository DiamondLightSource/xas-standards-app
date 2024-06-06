import { useState, useContext } from "react";

import { MetadataContext } from "../contexts/MetadataContext";

import axios from "axios";
import { AxiosResponse, AxiosError } from "axios";

import XDIFile from "../xdifile";

import "./StandardSubmission.css";
import ElementForm from "./ElementForm";
import SampleForm from "./SampleForm";
import InstrumentForm from "./InstrumentForm";
import CitationForm from "./CitationForm";
import AdditionalInformationForm from "./AdditionalInfoForm";

import { UserContext } from "../contexts/UserContext";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Input,
  Button,
  Stepper,
  Step,
  StepLabel,
  Container,
} from "@mui/material";

const standards_url = "/api/standards";

const steps = [
  "Upload standard XDI file",
  "Add measurement metadata",
  "Add sample metadata",
  "Add citation and additional information",
  "Confirm and submit",
];

function XDIFileUpload(props) {
  return (
    <>
      <Container>
        <Input type="file" name="file1" onChange={props.handleFile} />
        <Typography>
          Submitted file must be in xdi format and contain an energy column, and
          either "mu" datasets or "i" datasets with corresponding i0. Inclusion
          of Reference datasets (murefer or irefer with i0) is mandatory.
        </Typography>
      </Container>
    </>
  );
}

function StandardSubmissionStepper() {
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

  const { user } = useContext(UserContext);

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

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {[<XDIFileUpload handleReset={handleFile} />][activeStep]}
    </Box>
  );
}

export default StandardSubmissionStepper;
