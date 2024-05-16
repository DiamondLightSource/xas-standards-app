import "./App.css";

import Header from "./components/Header.tsx";
import { Routes, Route } from "react-router-dom";
import StandardViewer from "./components/StandardViewer.tsx";
import StandardSubmission from "./components/StandardSubmission.tsx";
import WelcomePage from "./components/WelcomePage.tsx";

import { MetadataProvider } from "./contexts/MetadataContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

import LogInPage from "./components/LogInPage.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

function App() {
  return (
    <div className="mainwindow">
      <UserProvider>
        <Header />
        <MetadataProvider>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/view" element={<StandardViewer />} />
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
    </div>
  );
}

export default App;
