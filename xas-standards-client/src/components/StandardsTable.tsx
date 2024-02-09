import { JSX, useState } from "react";
import axios from "axios";
import { XASStandard } from "../models";
import StandardMetadataTable from "./StandardMetadataTable";

import "./StandardsTable.css";

const standards_url = "/api/standards";

function GetButton(props: { setStandards: React.Dispatch<XASStandard[]> }) {
  const [name, setName] = useState("Push");

  const get_req = () => {
    setName("Element");
    axios.get(standards_url).then((response) => {
      const output: XASStandard[] = response.data.items as XASStandard[];
      props.setStandards(output);
    });
  };

  return <button onClick={get_req}> {name}</button>;
}

function StandardMetadata(props: {
  xasstandard: XASStandard | undefined;
  selected: XASStandard | undefined;
  updatePlot: React.Dispatch<XASStandard>;
}): JSX.Element {
  const className = props.xasstandard === props.selected ? "activeclicked" : "";

  if (!props.xasstandard) {
    return <div></div>;
  }

  return (
    <tr
      onClick={() => props.updatePlot(props.xasstandard)}
      key={props.xasstandard.id}
      className={className}
    >
      <td> {props.xasstandard.element.symbol} </td>
      <td> {props.xasstandard.edge.name} </td>
      <td> {props.xasstandard.sample_name} </td>
      <td> {props.xasstandard.sample_prep} </td>
      <td> {props.xasstandard.beamline.name} </td>
    </tr>
  );
}

function StandardsTable(props: {
  standards: XASStandard[];
  setStandards: React.Dispatch<XASStandard[]>;
  updatePlot: React.Dispatch<number>;
}): JSX.Element {
  const [selectedStandard, setSelectedStandard] = useState<XASStandard>();

  const clickStandard = (standard: XASStandard) => {
    props.updatePlot(standard.id);
    setSelectedStandard(standard);
  };

  return (
    <div className="standards-list">
      <GetButton setStandards={props.setStandards} />
      <table id="standards">
        <tbody>
          <tr>
            <th>Element</th>
            <th>Edge</th>
            <th>Name</th>
            <th>Prep</th>
            <th>Beamline</th>
          </tr>
          {props.standards.map((standard) =>
            StandardMetadata({
              xasstandard: standard,
              selected: selectedStandard,
              updatePlot: clickStandard,
            })
          )}
        </tbody>
      </table>
      <StandardMetadataTable standard={selectedStandard} />
    </div>
  );
}

export default StandardsTable;
