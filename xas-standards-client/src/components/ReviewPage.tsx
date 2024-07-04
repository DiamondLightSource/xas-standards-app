import ReviewTable from "./ReviewTable";

import { Grid } from "@mui/material";
import XASChart from "./StandardsChart";

import axios from "axios";

import { useState } from "react";

import { XASData, AdminXASStandard } from "../models";

const data_url = "/api/admin/data";

function ReviewPage() {
  const [standards, setStandardsList] = useState<AdminXASStandard[]>([]);

  const [xasdata, setXASData] = useState<XASData | null>(null);
  const [showTrans, setShowTrans] = useState(false);
  const [showFluor, setShowFluor] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [contains, setContains] = useState([false, false, false]);

  function getData() {
    return (id: number) => {
      axios.get(data_url + "/" + id + "/?format=json").then((response) => {
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

  const onClick = getData();
  return (
    <Grid height="100%" container>
      <Grid item xs={5} padding={1}>
        <ReviewTable
          standards={standards}
          updatePlot={onClick}
          setStandards={setStandardsList}
        />
      </Grid>
      <Grid item height="100%" xs={7} padding={1}>
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

export default ReviewPage;
