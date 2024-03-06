import { createContext } from "react";
import { AppMetadata } from "../models";
import useMetadata from "../hooks/useMetadata";

const MetadataContext = createContext<AppMetadata>({
  elements: [],
  edges: [],
  beamlines: [],
  licences: [],
});

function MetadataProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const appMetadata = useMetadata();

  return (
    <MetadataContext.Provider value={appMetadata}>
      {children}
    </MetadataContext.Provider>
  );
}

export { MetadataContext, MetadataProvider };
