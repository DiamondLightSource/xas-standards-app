import "./ElementSelector.css";
import React, { useRef, useState } from "react";
import { usePopper } from "react-popper";
import SimplePeriodicTable from "./PeriodicTable";
import { Element } from "../models";

function ElementSelector(props: {
  elements: Element[];
  selectedElement: number;
  setSelectedElement: React.Dispatch<number>;
}) {
  const elements = props.elements;
  const [pop, setPop] = useState(false);
  const boxRef = useRef();
  const tooltipRef = useRef();
  const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current);

  return (
    <div className="elementselector">
      <div className="elementLabel">Element</div>
      <select
        name="element"
        id="elementMain"
        value={props.selectedElement}
        onChange={(e) => {
          props.setSelectedElement(e.target.value);
        }}
      >
        <option key={-1} value={0}>
          All
        </option>
        {elements.map((x, y) => (
          <option key={y} value={x.z}>
            {x.symbol}
          </option>
        ))}
      </select>
      <div>
        <button ref={boxRef} onClick={() => setPop(!pop)}>
          Periodic Table
        </button>
        <div
          className="ptpop"
          hidden={!pop}
          ref={tooltipRef}
          style={styles.popper}
          {...attributes.popper}
        >
          <SimplePeriodicTable
            onClickElement={(el) => {
              props.setSelectedElement(el);
              setPop(false);
            }}
            elementSize={55}
          />
        </div>
      </div>
    </div>
  );
}

export default ElementSelector;
