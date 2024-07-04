import StandardsTableView from "./StandardsTableView"

import { Stack } from "@mui/material";

import {AdminXASStandard, XASStandard } from "../models";

import { useState, useEffect } from "react";

import axios from "axios";
import ReviewTab from "./ReviewTab";


const standards_url = "/api/admin/standards";

const nResults = 7;

export default function ReviewTable(props : {
    standards: AdminXASStandard[];
    setStandards: (standards : XASStandard[]) => void;
    updatePlot: (id : number) => void;
}) {

    const [selectedStandard, setSelectedStandard] = useState<AdminXASStandard>();
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
        const output: AdminXASStandard[] = response.data.items as AdminXASStandard[];
        setPrevNext([response.data.previous_page, response.data.next_page]);
        setStandards(output);
      });
    };
    get_req(current);
  }, [current, setStandards]);

  const stds: (AdminXASStandard | null)[] = [...props.standards];

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
        {selectedStandard && 
        <ReviewTab standard={selectedStandard}/>
      }
        </Stack>
    )
}