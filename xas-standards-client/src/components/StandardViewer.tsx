import { useState } from "react";

import XASChart from "./StandardsChart.tsx";
import axios from "axios";
import StandardsTable from "./StandardsTable.tsx";

import { XASStandard, XASData } from "../models.ts";

const data_url = "/api/data";

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
      <StandardsTable
        standards={standards}
        updatePlot={onClick}
        setStandards={setStandardsList}
      />
      <XASChart xasdata={xasdata} />
    </div>
  );
}

export default StandardViewer;
