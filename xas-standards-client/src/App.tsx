import Header from "./components/Header.tsx";
import { Routes, Route } from "react-router-dom";
import StandardViewerMui from "./components/StandardViewer.tsx";
import StandardSubmission from "./components/submission/StandardSubmission.tsx";
import WelcomePage from "./components/WelcomePage.tsx";

import { MetadataProvider } from "./contexts/MetadataContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

import LogInPage from "./components/LogInPage.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

import { CssBaseline } from "@mui/material";
import { useMediaQuery } from "@mui/material";

import { useState, useMemo } from "react";
import { Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import ReviewPage from "./components/ReviewPage.tsx";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack height="100vh" width="100vw" spacing={1}>
        <UserProvider>
          <Header
            colorMode={mode}
            toggleColorMode={colorMode.toggleColorMode}
          />
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
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/login" element={<LogInPage />} />
            </Routes>
          </MetadataProvider>
        </UserProvider>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
