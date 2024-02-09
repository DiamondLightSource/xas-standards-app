import axios from "axios";

const crossref_url = "https://api.crossref.org/works/";
const mailto = "?mailto=dataanalysis@diamond.ac.uk";

function CitationForm(props) {
  const citation = props.citation;
  const setCitation = props.setCitation;
  const doi = props.doi;
  const setDOI = props.setDOI;

  const validateDOI = () => {
    // prettier-ignore
    const doi_regex = "^10.\\d{4,9}\\/[-._;()\\/:A-Z0-9]+$"; // eslint-disable-line
    const matches = new RegExp(doi_regex).test(doi);

    const full_url = encodeURI(crossref_url + doi + "/" + mailto);

    if (matches) {
      axios
        .get(full_url)
        .then((res) => {
          console.log("valid");
        })
        .catch((error) => {
          console.log("not valid");
        });
    }
  };

  return (
    <fieldset className="twocolumn">
      <legend>Reference</legend>
      <label htmlFor="citation">Citation</label>
      <input
        type="text"
        id="citation"
        value={citation}
        onChange={(e) => setCitation(e.target.value)}
        required
      ></input>
      <label htmlFor="doi">DOI</label>
      <input
        type="text"
        id="doi"
        value={doi}
        onChange={(e) => setDOI(e.target.value)}
        required
      ></input>
      <button type="button" onClick={validateDOI}>
        Validate DOI
      </button>
    </fieldset>
  );
}

export default CitationForm;
