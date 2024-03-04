function ElementForm(props) {
  const elementId = props.elementId;
  const setElementID = props.setElementId;
  const edgeId = props.edgeId;
  const setEdgeID = props.setEdgeId;
  const elements = props.elements;
  const edges = props.edges;

  return (
    <fieldset className="twocolumn">
      <legend>XAS Measurement</legend>
      <label htmlFor="element">Element</label>
      <select
        name="element"
        id="element"
        value={elementId}
        onChange={(e) => setElementID(e.target.value)}
      >
        {elements.map((x, y) => (
          <option key={y} value={x.z}>
            {x.symbol}
          </option>
        ))}
      </select>
      <label htmlFor="edge">Edge</label>
      <select
        name="edge"
        id="edge"
        onChange={(e) => setEdgeID(e.target.value)}
        value={edgeId}
      >
        {edges.map((x, y) => (
          <option key={y} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

export default ElementForm;
