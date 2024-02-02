import { useState } from "react";

import XASChart from "./StandardsChart.tsx";
import axios from "axios";
import StandardsTable from "./StandardsTable.tsx";

import { XASStandard, XASData } from "../models.ts";

const standards_url = "/api/standards";
const data_url = "/api/data";

function GetButton(props: { setStandards: React.Dispatch<XASStandard[]> }) {
  const [name, setName] = useState("Push");

  const get_req = () => {
    setName("working");
    axios.get(standards_url).then((response) => {
      const output: XASStandard[] = response.data.items as XASStandard[];
      props.setStandards(output);
      setName("Got");
    });
  };

  return <button onClick={get_req}> {name}</button>;
}

function getData(setXASData: React.Dispatch<XASData>) {
  return (id: number) => {
    axios.get(data_url + "/" + id).then((response) => {
      const output: XASData = response.data as XASData;
      setXASData(output);
    });
  };
}

function StandardViewer() {
  const [standards, setStandardsList] = useState<XASStandard[]>([]);

  const [xasdata, setXASData] = useState<XASData | null>(null);

  const onClick = getData(setXASData);

  return (
    <div className="mainbody">
      <GetButton setStandards={setStandardsList} />
      <StandardsTable standards={standards} updatePlot={onClick} />
      <XASChart xasdata={xasdata} />
    </div>
  );
}

export default StandardViewer;
