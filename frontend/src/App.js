import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./views/landing/landing-view";
import { history } from "./helpers/history";

function App() {
  return (
    <div>
      <Routes history={history}>
        <Route exact path="/*" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
