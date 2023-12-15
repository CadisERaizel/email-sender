import React, { useEffect } from "react";
import { BrowserRouter, HashRouter, Routes, Route, Link } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import PrivateRoute from "./PrivateRoute";
import { useMsal } from "@azure/msal-react";

function App() {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);
  return (
    <HashRouter>
      {isAuthenticated ?
        (<PrivateRoute />
        ) : (
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/logout" element={<LoginScreen />} />
          </Routes>)}
    </HashRouter>
  );
}

export default App;
