import { Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdminXASStandard } from "../models";

const data_url = "/api/admin/data"

export default function ReviewTextView(props: {standard : AdminXASStandard}) {

    const [fileString, setFileString] = useState("")

    useEffect(() => {
        const get_req = (id : number) => {
    
    
          axios.get(data_url + "/" + id).then((response) => {
            setFileString(response.data)
          });
        };
        get_req(props.standard.id);
      }, [props.standard, setFileString]);

    return (
    <Box>
        <Typography sx={{whiteSpace:'pre-line',overflow:"scroll", maxHeight:"20em"}}>
        {fileString}
        </Typography>
    </Box>)
}