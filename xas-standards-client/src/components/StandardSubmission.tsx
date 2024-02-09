import { useState, useEffect } from "react";

import axios from "axios";

import XDIFile from "../xdifile";

import "./StandardSubmission.css";
import ElementForm from "./ElementForm";
import SampleForm from "./SampleForm";
import InstrumentForm from "./InstrumentForm";
import CitationForm from "./CitationForm";
import AdditionalInformationForm from "./AdditionalInfoForm";

import { Edge, Element } from "../models";

const standards_url = "/api/standards";
const beamlines_url = "/api/beamlines";
const elements_url = "/api/elements";
const edges_url = "/api/edges";
const licences_url = "/api/licences";

function StandardSubmission() {
  const [file, setFile] = useState<File>();
  const [file2, setFile2] = useState<FileList>();

  const [elementId, setElementId] = useState(1);
  const [edgeId, setEdgeId] = useState(1);
  const [sampleName, setSampleName] = useState("");
  const [sampleComp, setSampleComp] = useState("");
  const [samplePrep, setSamplePrep] = useState("");
  const [beamlineId, setBeamlineId] = useState(1);
  const [doi, setDOI] = useState("");
  const [date, setDate] = useState("");
  const [licence, setLicence] = useState("");
  const [citation, setCitation] = useState("");
  const [comments, setComments] = useState("");

  const [beamlines, setBeamlines] = useState([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [licences, setLicences] = useState([]);

  useEffect(() => {
    axios.get(beamlines_url).then((res) => {
      setBeamlines(res.data);
    });

    axios.get(elements_url).then((res) => {
      setElements(res.data);
    });

    axios.get(edges_url).then((res) => {
      setEdges(res.data);
    });

    axios.get(licences_url).then((res) => {
      setLicences(res.data);
      setLicence(res.data[0]);
    });
  }, []);

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

    axios.post(standards_url, form);
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const fileReader = new FileReader();

      fileReader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target != null && typeof e.target.result === "string") {
          const xdifile = XDIFile.parseFile(e.target.result);

          const el = elements.find((e) => e.symbol === xdifile.element);
          const ed = edges.find((e) => e.name === xdifile.edge);

          //TODO UPDATE TO USE ID
          setElementId(el?.z ?? elementId);
          setEdgeId(ed?.id ?? edgeId);
          setSampleName(xdifile.sample?.name ?? sampleName);
          setSampleComp(xdifile.sample?.stoichiometry ?? sampleComp);
          setSamplePrep(xdifile.sample?.prep ?? samplePrep);
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
    <div className="submissionpage">
      <h2>Upload XDI file</h2>
      <form className="submissionpage" onSubmit={handleSubmit}>
        <input type="file" name="file1" onChange={handleFile} />
        <div>
          Submitted file must be in xdi format and contain an energy column, and
          either "mu" datasets or "i" datasets with corresponding i0. Inclusion
          of Reference datasets (murefer or irefer with i0) is mandatory.
        </div>
        <ElementForm
          elementId={elementId}
          setElementId={setElementId}
          edgeId={edgeId}
          setEdgeId={setEdgeId}
          elements={elements}
          edges={edges}
        />
        <SampleForm
          sampleName={sampleName}
          setSampleName={setSampleName}
          sampleComp={sampleComp}
          samplePrep={samplePrep}
          setSamplePrep={setSamplePrep}
        />
        <InstrumentForm
          beamlines={beamlines}
          setBeamlineId={setBeamlineId}
          beamlineId={beamlineId}
          date={date}
          setDate={setDate}
        />
        <CitationForm
          citation={citation}
          setCitation={setCitation}
          doi={doi}
          setDOI={setDOI}
        />
        <AdditionalInformationForm
          comments={comments}
          setComments={setComments}
          handleFile2={handleFile2}
        />
        <label htmlFor="Licence">Choose a Licence:</label>
        <select
          name="licence"
          id="licence"
          value={licence}
          onChange={(e) => setLicence(e.target.value)}
        >
          {licences.map((x, y) => (
            <option key={y}>{x}</option>
          ))}
        </select>
        <input type="checkbox" id="agree" name="agree" value="agree" />
        <label htmlFor="agree">
          {" "}
          By ticking I confirm info is correct and I grant permission for
          diamond to publish data under selected licence
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default StandardSubmission;
