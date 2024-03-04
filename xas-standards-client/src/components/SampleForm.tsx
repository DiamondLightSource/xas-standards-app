function SampleForm(props) {
  const sampleName = props.sampleName;
  const setSampleName = props.setSampleName;
  const sampleComp = props.sampleComp;
  const setSampleComp = props.setSampleComp;
  const samplePrep = props.samplePrep;
  const setSamplePrep = props.setSamplePrep;

  return (
    <fieldset className="twocolumn">
      <legend>Sample Information</legend>
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
      <label htmlFor="sampleform">Sample Form</label>
      <input type="text" id="sampleform"></input>
    </fieldset>
  );
}

export default SampleForm;
