import { useState, useEffect } from "react";

import axios from "axios";

import XDIFile from "../xdifile";

import "./StandardSubmission.css";

const standards_url = "/api/standards";
const beamlines_url = "/api/beamlines";

//https://api.crossref.org/works/10.1039/C2AN35914F/?mailto=jacob.filik@diamond.ac.uk

function StandardSubmission() {
  const [file, setFile] = useState<File>();
  const [file2, setFile2] = useState<FileList>();

  const [element, setElement] = useState("");
  const [edge, setEdge] = useState("");
  const [sampleName, setSampleName] = useState("");
  const [sampleComp, setSampleComp] = useState("");
  const [samplePrep, setSamplePrep] = useState("");
  const [doi, setDOI] = useState("");
  const [date, setDate] = useState("");
  const [licence, setLicence] = useState("CC BY");

  const [beamlines, setBeamlines] = useState([]);

  useEffect(() => {
    axios.get(beamlines_url).then((res) => {
      console.log(res.data[0].name);
      setBeamlines(res.data);
    });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //build form data by hand to get correct
    //serialisation of addition_files
    //so it is not called additional_files[]
    const form = new FormData();

    form.append("xdi_file", file);
    form.append("element", element);
    form.append("edge", edge);
    form.append("sampleName", sampleName);
    form.append("sampleComp", sampleComp);
    form.append("samplePrep", samplePrep);
    form.append("licence", licence);

    for (let i = 0; i < file2.length; i++) {
      form.append("additional_files", file2[i]);
    }

    axios.post(standards_url, form);
  };

  const setBeamline = (event: React.ChangeEvent<HTMLSelectElement>) => {};

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const fileReader = new FileReader();

      fileReader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target != null && typeof e.target.result === "string") {
          const xdifile = XDIFile.parseFile(e.target.result);

          setElement(xdifile.element ?? element);
          setEdge(xdifile.edge ?? edge);
          setSampleName(xdifile.sample[XDIFile.NAME] ?? sampleName);
          setSampleComp(xdifile.sample[XDIFile.STOICHIOMETRY] ?? sampleComp);
          setSamplePrep(xdifile.sample[XDIFile.PREP] ?? samplePrep);

          console.log(xdifile.sample);
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

  const validateDOI = () => {
    // prettier-ignore
    const doi_regex = "^10.\\d{4,9}\\/[-._;()\\/:A-Z0-9]+$"; // eslint-disable-line
    const found = new RegExp(doi_regex).test(doi);
    console.log("found", found + " DOI " + doi);
  };

  return (
    <div className="submissionpage">
      <h1>Upload XDI file</h1>
      <form className="submissionpage" onSubmit={handleSubmit}>
        <input type="file" name="file1" onChange={handleFile} />
        <label htmlFor="element">Element</label>
        <input
          type="text"
          id="element"
          value={element}
          onChange={(e) => setElement(e.target.value)}
        ></input>
        <label htmlFor="edge">Edge</label>
        <input
          type="text"
          id="edge"
          value={edge}
          onChange={(e) => setEdge(e.target.value)}
        ></input>
        <label htmlFor="samplename">Sample Name</label>
        <input
          type="text"
          id="samplename"
          value={sampleName}
          onChange={(e) => setSampleName(e.target.value)}
        ></input>
        <label htmlFor="composition">Sample Composition</label>
        <input
          type="text"
          id="composition"
          value={sampleComp}
          onChange={(e) => setSampleComp(e.target.value)}
        ></input>
        <label htmlFor="preparation">Sample Prep</label>
        <input
          type="text"
          id="preparation"
          value={samplePrep}
          onChange={(e) => setSamplePrep(e.target.value)}
        ></input>
        <label htmlFor="beamline">Beamline</label>
        <select name="beamline" id="beamline" onChange={(e) => setBeamline(e)}>
          {beamlines.map((x, y) => (
            <option key={y}>{x.name + " " + x.facility.name}</option>
          ))}
        </select>
        <label htmlFor="date">Date Measured</label>
        <input type="text" id="date"></input>
        <label htmlFor="citation">Citation</label>
        <input type="text" id="citation"></input>
        <label htmlFor="doi">DOI</label>
        <input
          type="text"
          id="doi"
          value={doi}
          onChange={(e) => setDOI(e.target.value)}
        ></input>
        <button type="button" onClick={validateDOI}>
          Validate DOI
        </button>
        <label htmlFor="cooments">Comments</label>
        <input type="text" id="comments"></input>
        <label htmlFor="Licence">Choose a Licence:</label>
        <select
          name="licence"
          id="licence"
          onChange={(e) => setLicence(e.target.value)}
        >
          <option value="CC BY">CC BY</option>
          <option value="CC BY-SA">CC BY-SA</option>{" "}
        </select>
        <input type="file" name="file2" onChange={handleFile2} multiple />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default StandardSubmission;
