import { useState, useEffect } from "react";

import XASChart from "./StandardsChart.tsx";
import axios from "axios";
import StandardsTable from "./StandardsTable.tsx";
import { Element } from "../models.ts";

import { XASStandard, XASData } from "../models.ts";

const data_url = "/api/data";
const elements_url = "/api/elements";

function StandardViewer() {
  const [standards, setStandardsList] = useState<XASStandard[]>([]);

  const [xasdata, setXASData] = useState<XASData | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [showTrans, setShowTrans] = useState(false);
  const [showFluor, setShowFluor] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [contains, setContains] = useState([false, false, false]);

  function getData(setXASData: React.Dispatch<XASData>) {
    return (id: number) => {
      axios.get(data_url + "/" + id).then((response) => {
        const output: XASData = response.data as XASData;
        const containsTrans = output != null && output.mutrans.length != 0;
        const containsFluor = output != null && output.mufluor.length != 0;
        const containsRef = output != null && output.murefer.length != 0;

        setShowTrans(containsTrans);
        setShowRef(containsRef);
        setShowFluor(containsFluor);
        setContains([containsTrans, containsFluor, containsRef]);

        setXASData(output);
      });
    };
  }

  const onClick = getData(setXASData);

  useEffect(() => {
    axios.get(elements_url).then((res) => {
      setElements(res.data);
    });
  }, []);

  return (
    <div className="mainbody">
      <StandardsTable
        standards={standards}
        elements={elements}
        updatePlot={onClick}
        setStandards={setStandardsList}
      />
      <XASChart
        xasdata={xasdata}
        showTrans={showTrans}
        showFluor={showFluor}
        showRef={showRef}
        setShowTrans={setShowTrans}
        setShowFluor={setShowFluor}
        setShowRef={setShowRef}
        contains={contains}
      />
    </div>
  );
}

export default StandardViewer;
