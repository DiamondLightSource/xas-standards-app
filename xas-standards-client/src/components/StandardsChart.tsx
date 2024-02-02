import { LineVis, getDomain } from "@h5web/lib";
import "@h5web/lib/dist/styles.css";

import ndarray from "ndarray";
import { XASData } from "../models";

function XASChart(props: { xasdata: XASData | null }) {
  if (props.xasdata === null || Object.keys(props.xasdata).length === 0) {
    return (
      <LineVis dataArray={ndarray([0])} domain={getDomain(ndarray([0]))} />
    );
  }

  const xdata = ndarray(props.xasdata.energy, [props.xasdata.energy.length]);
  const ydata = ndarray(props.xasdata.itrans, [props.xasdata.itrans.length]);

  const domain = getDomain(ydata);

  return (
    <LineVis
      abscissaParams={{ value: xdata.data }}
      dataArray={ydata}
      domain={domain}
    />
  );
}

export default XASChart;
