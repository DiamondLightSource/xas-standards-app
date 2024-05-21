import { useState, useContext } from "react";

import XASChart from "./StandardsChart.tsx";
import axios from "axios";
import StandardsTable from "./StandardsTableMui.tsx";

import { XASStandard, XASData } from "../models.ts";
import { MetadataContext } from "../contexts/MetadataContext.tsx";

import { Grid } from "@mui/material";
import Box from "@mui/material";

const data_url = "/api/data";

function StandardViewer() {
  const [standards, setStandardsList] = useState<XASStandard[]>([]);

  const [xasdata, setXASData] = useState<XASData | null>(null);
  const [showTrans, setShowTrans] = useState(false);
  const [showFluor, setShowFluor] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [contains, setContains] = useState([false, false, false]);

  const { elements } = useContext(MetadataContext);

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

  return (
    <Grid height="100%" container>
      <Grid xs={5} padding={1}>
        <StandardsTable
          standards={standards}
          elements={elements}
          updatePlot={onClick}
          setStandards={setStandardsList}
        />
      </Grid>
      <Grid height="100%" xs={7} padding={1}>
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
      </Grid>
    </Grid>
  );
}

export default StandardViewer;
