import {
  LineVis,
  getDomain,
  Separator,
  Selector,
  Toolbar,
  GridToggler,
  ScaleType,
  CurveType,
  ToggleBtn,
} from "@h5web/lib";
import "@h5web/lib/dist/styles.css";

import "./StandardsChart.css";

import { useEffect, useState } from "react";

import ndarray from "ndarray";
import { XASData } from "../models";

function CurveOption(props: { option: CurveType }) {
  const { option } = props;

  return (
    <div>
      <span>{String(option)}</span>
    </div>
  );
}

function XASChart(props) {
  const curveOptions: CurveType[] = Object.values(
    CurveType
  ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
  const [curveOption, setCurveOption] = useState(curveOptions[0]);

  let xdata: ndarray.NdArray<number[]> = ndarray([0]);
  let ydata: ndarray.NdArray<number[]> = ndarray([0]);

  const aux = [];

  let ydataLabel = "";

  const hideAll = !props.showTrans && !props.showFluor && !props.showRef;

  if (props.xasdata != null && !hideAll) {
    xdata = ndarray(props.xasdata.energy, [props.xasdata.energy.length]);

    let primaryFound = false;

    if (props.showTrans) {
      primaryFound = true;
      ydata = ndarray(props.xasdata.mutrans, [props.xasdata.mutrans.length]);
      ydataLabel = "Transmission";
    }

    if (props.showFluor) {
      const fdata = ndarray(props.xasdata.mufluro, [
        props.xasdata.mutrans.length,
      ]);
      if (!primaryFound) {
        primaryFound = true;
        ydata = fdata;
        ydataLabel = "Fluorescence";
      } else {
        aux.push({ label: "Fluorescence", array: fdata });
      }
    }

    if (props.showRef) {
      const rdata = ndarray(props.xasdata.murefer, [
        props.xasdata.murefer.length,
      ]);
      if (!primaryFound) {
        primaryFound = true;
        ydata = rdata;
        ydataLabel = "Reference";
      } else {
        aux.push({ label: "Reference", array: rdata });
      }
    }
  }

  const domain = getDomain(ydata);

  return (
    <div className="chartbody">
      <div className="charttoolbar">
        <Toolbar>
          <Separator />
          <ToggleBtn
            label="Transmission"
            value={props.showTrans}
            onToggle={() => {
              console.log(!props.showTrans);
              props.setShowTrans(!props.showTrans);
            }}
            disabled={!props.contains[0]}
          />
          <ToggleBtn
            label="Fluorescence"
            value={props.showFluor}
            onToggle={() => props.setShowFluor(!props.showFluor)}
            disabled={!props.contains[1]}
          />
          <ToggleBtn
            label="Reference"
            value={props.showRef}
            onToggle={() => props.setShowRef(!props.showRef)}
            disabled={!props.contains[2]}
          />
          <Separator />
          <Selector<CurveType>
            label="Line Style"
            onChange={(o) => {
              setCurveOption(o);
            }}
            options={curveOptions}
            value={curveOption}
            optionComponent={CurveOption}
          />
          <Separator />
          <GridToggler onToggle={() => setUseGrid(!useGrid)} value={useGrid} />
        </Toolbar>
      </div>
      <div className="chartarea">
        <LineVis
          abscissaParams={{
            value: xdata.data,
            scaleType: ScaleType.Linear,
            label: "Energy",
          }}
          dataArray={ydata}
          ordinateLabel={ydataLabel}
          domain={domain}
          showGrid={useGrid}
          curveType={curveOption}
          scaleType={ScaleType.SymLog}
          auxiliaries={aux}
        />
      </div>
    </div>
  );
}

export default XASChart;
