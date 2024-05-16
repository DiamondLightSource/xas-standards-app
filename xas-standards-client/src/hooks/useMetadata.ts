import { useEffect, useState } from "react";
import axios from "axios";

const metadata_url = "/api/metadata";

import { AppMetadata } from "../models";

function useMetadata(): AppMetadata {
  const [appMetadata, setAppMetdata] = useState<AppMetadata>({
    beamlines: [],
    elements: [],
    edges: [],
    licences: [],
  });

  useEffect(() => {
    axios.get(metadata_url).then((res) => {
      setAppMetdata(res.data);
    });
  }, []);

  return appMetadata;
}

export default useMetadata;
