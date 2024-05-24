import HeaderMui from "./components/Header.tsx";
import { Routes, Route } from "react-router-dom";
import StandardViewerMui from "./components/StandardViewer.tsx";
import StandardSubmission from "./components/StandardSubmission.tsx";
import WelcomePage from "./components/WelcomePage.tsx";

import { MetadataProvider } from "./contexts/MetadataContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

import LogInPage from "./components/LogInPage.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

import { CssBaseline } from "@mui/material";

import Box from "@mui/material/Box";

import { useState, useMemo, createContext } from "react";
import { Stack, Toolbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import ColorModeContext from "./contexts/ColorModeContext.tsx";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
