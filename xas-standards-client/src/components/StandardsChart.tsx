import {
  LineVis,
  getDomain,
  Separator,
  ScaleSelector,
  Toolbar,
  GridToggler,
} from "@h5web/lib";
import "@h5web/lib/dist/styles.css";

import "./StandardsChart.css";

import { useState } from "react";

import ndarray from "ndarray";
import { XASData } from "../models";

function XASChart(props: { xasdata: XASData | null }) {
  if (props.xasdata === null || Object.keys(props.xasdata).length === 0) {
    return (
      <LineVis dataArray={ndarray([0])} domain={getDomain(ndarray([0]))} />
    );
  }

  const xdata = ndarray(props.xasdata.energy, [props.xasdata.energy.length]);
  const ydata = ndarray(props.xasdata.mutrans, [props.xasdata.mutrans.length]);

  const ref = ndarray(props.xasdata.murefer, [props.xasdata.murefer.length]);
  const domain = getDomain(ydata);

  const [useGrid, setUseGrid] = useState(true);

  const toggle = () => setUseGrid(!useGrid);

  return (
    <div className="chartbody">
      <div className="charttoolbar">
        <Toolbar>
          <Separator />
          <ScaleSelector
            label="X"
            onScaleChange={function Ga() {}}
            options={["linear", "log", "symlog"]}
            value="linear"
          />
          <ScaleSelector
            label="Y"
            onScaleChange={function Ga() {}}
            options={["linear", "log", "symlog"]}
            value="linear"
          />
          <Separator />
          <GridToggler onToggle={toggle} />
        </Toolbar>
      </div>
      <div className="chartarea">
        <LineVis
          abscissaParams={{ value: xdata.data }}
          dataArray={ydata}
          domain={domain}
          auxiliaries={[{ label: "Reference", array: ref }]}
        />
      </div>
    </div>
  );
}

export default XASChart;
