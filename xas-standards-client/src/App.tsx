import "./App.css";

import Header from "./components/Header.tsx";
import { Routes, Route } from "react-router-dom";
import StandardViewer from "./components/StandardViewer.tsx";
import StandardSubmission from "./components/StandardSubmission.tsx";
import WelcomePage from "./components/WelcomePage.tsx";

import { MetadataProvider } from "./contexts/MetadataContext.tsx";

function App() {
  return (
    <div className="mainwindow">
      <Header />
      <MetadataProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/view" element={<StandardViewer />} />
          <Route path="/submit" element={<StandardSubmission />} />
          {/* <Route path="/review" element={<ReviewPage />} /> */}
        </Routes>
      </MetadataProvider>
    </div>
  );
}

export default App;
