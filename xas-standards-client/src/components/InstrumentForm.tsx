function InstrumentForm(props) {
  const beamlines = props.beamlines;
  const beamlineHeader = props.beamlineHeader;
  const setBeamlineId = props.setBeamlineId;
  const beamlineId = props.beamlineId;
  const date = props.date;
  const setDate = props.setDate;

  return (
    <fieldset className="twocolumn">
      <legend>Instrument</legend>
      <label htmlFor="beamline">Beamline</label>
      <select
        name="beamline"
        id="beamline"
        value={beamlineId}
        onChange={(e) => setBeamlineId(e.target.value)}
      >
        {beamlines.map((x, y) => (
          <option key={y} value={x.id}>
            {x.name + " " + x.facility.name}
          </option>
        ))}
      </select>
      <div>Beamline from Header:</div>
      <div>{beamlineHeader}</div>
      <label htmlFor="date">Date Measured</label>
      <input
        type="datetime-local"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      ></input>
    </fieldset>
  );
}

export default InstrumentForm;
