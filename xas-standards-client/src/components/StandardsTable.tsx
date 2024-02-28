import { JSX, useState, useEffect } from "react";
import { XASStandard } from "../models";
import StandardMetadataTable from "./StandardMetadataTable";
import "./StandardsTable.css";
import axios from "axios";

import { Element } from "../models";

import ElementSelector from "./ElementSelector";

const standards_url = "/api/standards";

const nResults = 7;

function StandardMetadata(props: {
  key: number;
  xasstandard: XASStandard | null;
  selected: XASStandard | undefined;
  updatePlot: React.Dispatch<XASStandard>;
}): JSX.Element {
  const className = props.xasstandard === props.selected ? "activeclicked" : "";

  return (
    <tr
      onClick={() => props.updatePlot(props.xasstandard!)}
      key={props.key}
      className={className}
    >
      <td> {props.xasstandard?.element.symbol ?? "\xa0"} </td>
      <td> {props.xasstandard?.edge.name ?? ""}</td>
      <td> {props.xasstandard?.sample_name ?? ""}</td>
      <td> {props.xasstandard?.sample_prep ?? ""}</td>
      <td> {props.xasstandard?.beamline.name ?? ""}</td>
    </tr>
  );
}

function StandardsTable(props: {
  standards: XASStandard[];
  elements: Element[];
  setStandards: React.Dispatch<XASStandard[]>;
  updatePlot: React.Dispatch<number>;
}): JSX.Element {
  const [selectedStandard, setSelectedStandard] = useState<XASStandard>();
  const [prevNext, setPrevNext] = useState<string[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<number>(0);

  const setStandards = props.setStandards;
  const elements = props.elements;

  const clickStandard = (standard: XASStandard) => {
    props.updatePlot(standard.id);
    setSelectedStandard(standard);
  };

  const nextPage = () => {
    setCurrent(prevNext[1]);
  };

  const prevPage = () => {
    setCurrent(prevNext[0]);
  };

  useEffect(() => {
    const get_req = (z: number, cursor: string | null) => {
      let url = standards_url;

      let symbol = null;

      if (z > 0) {
        symbol = elements[z - 1].symbol;
      }

      if (symbol != null) {
        url =
          standards_url + "?element=" + symbol + "&size=" + String(nResults);
      } else {
        url = url + "?size=" + String(nResults);
      }

      if (cursor) {
        url = url + "&cursor=" + cursor;
      }

      axios.get(url).then((response) => {
        const output: XASStandard[] = response.data.items as XASStandard[];
        setPrevNext([response.data.previous_page, response.data.next_page]);
        setStandards(output);
      });
    };
    get_req(selectedElement, current);
  }, [selectedElement, current, setStandards, elements]);

  const stds: (XASStandard | null)[] = [...props.standards];

  if (props.standards.length < nResults) {
    while (stds.length < nResults) {
      stds.push(null);
    }
  }

  return (
    <div className="standards-list">
      <ElementSelector
        elements={elements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
      <table id="standards">
        <tbody>
          <tr>
            <th>Element</th>
            <th>Edge</th>
            <th>Name</th>
            <th>Prep</th>
            <th>Beamline</th>
          </tr>
          {stds.map((standard, key) =>
            StandardMetadata({
              key: key,
              xasstandard: standard,
              selected: selectedStandard,
              updatePlot: clickStandard,
            })
          )}
        </tbody>
      </table>
      <div>
        <button
          disabled={prevNext == null || prevNext[0] == null}
          onClick={prevPage}
        >
          &lt;
        </button>
        <button
          disabled={prevNext == null || prevNext[1] == null}
          onClick={nextPage}
        >
          &gt;
        </button>
      </div>
      <StandardMetadataTable standard={selectedStandard} />
    </div>
  );
}

export default StandardsTable;
