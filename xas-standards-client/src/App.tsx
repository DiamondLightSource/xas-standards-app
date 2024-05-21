import HeaderMui from "./components/HeaderMui.tsx";
import { Routes, Route } from "react-router-dom";
import StandardViewerMui from "./components/StandardViewerMui.tsx";
import StandardSubmission from "./components/StandardSubmission.tsx";
import WelcomePage from "./components/WelcomePage.tsx";

import { MetadataProvider } from "./contexts/MetadataContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

import LogInPage from "./components/LogInPage.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

import Box from "@mui/material/Box";
import { Stack, Toolbar } from "@mui/material";

function App() {
  return (
    <Stack height="100vh" width="100vw" spacing={1}>
      <UserProvider>
        <HeaderMui />
        <MetadataProvider>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/view" element={<StandardViewerMui />} />
            <Route
              path="/submit"
              element={
                <RequireAuth>
                  <StandardSubmission />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<LogInPage />} />
            {/* <Route path="/review" element={<ReviewPage />} /> */}
          </Routes>
        </MetadataProvider>
      </UserProvider>
    </Stack>
  );
}

export default App;
