
import { Tab, Tabs, Box} from "@mui/material";

import StandardMetadataCard from "./StandardMetadataCard";
import ReviewTextView from "./ReviewTextView";

import { useState } from "react";
import ReviewCard from "./ReviewCard";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function ReviewTab(props: { standard: XASStandard }) {
    const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Standard" {...a11yProps(0)} />
          <Tab label="Submitted File" {...a11yProps(1)} />
          <Tab label="Review" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <StandardMetadataCard standard={props.standard}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <ReviewTextView standard={props.standard}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <ReviewCard standard={props.standard} />
      </CustomTabPanel>
    </Box>
  );
}