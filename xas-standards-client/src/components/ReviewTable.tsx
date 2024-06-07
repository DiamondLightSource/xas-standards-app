import StandardsTableView from "./StandardsTableView"
import StandardMetadataCard from "./StandardMetadataCard";

import { Stack } from "@mui/material";

import { XASStandard } from "../models";

import { useState, useEffect } from "react";

import axios from "axios";


const standards_url = "/api/standards";

const nResults = 7;

export default function ReviewTable(props : {
    standards: XASStandard[];
    setStandards: React.Dispatch<XASStandard[]>;
    updatePlot: React.Dispatch<number>;
}) {

    const [selectedStandard, setSelectedStandard] = useState<XASStandard>();
    const [current, setCurrent] = useState<string | null>(null);
    const [prevNext, setPrevNext] = useState<string[] | null>(null);

    const setStandards = props.setStandards;
  useEffect(() => {
    const get_req = (cursor: string | null) => {
      let url = standards_url;



    url = url + "?size=" + String(nResults);
 

      if (cursor) {
        url = url + "&cursor=" + cursor;
      }

      axios.get(url).then((response) => {
        const output: XASStandard[] = response.data.items as XASStandard[];
        setPrevNext([response.data.previous_page, response.data.next_page]);
        setStandards(output);
      });
    };
    get_req(current);
  }, [current, setStandards]);

  const stds: (XASStandard | null)[] = [...props.standards];

  if (props.standards.length < nResults) {
    while (stds.length < nResults) {
      stds.push(null);
    }
  }
    return (
        <Stack spacing={2}>
    <StandardsTableView standards={props.standards}
        updatePlot={props.updatePlot}
        selectedStandard={selectedStandard}
        setSelectedStandard={setSelectedStandard} 
        setCurrent={setCurrent}
        prevNext={prevNext}/>
        <StandardMetadataCard standard={selectedStandard} />
        </Stack>
    )
}