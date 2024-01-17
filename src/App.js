import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import PrivateRoute from "./PrivateRoute";
import { validateUser } from "./apis/apis";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function getAuthentication() {
      const response = await validateUser();
      setIsAuthenticated(response.authentication)
    }
    getAuthentication()
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <PrivateRoute />
      ) : (
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/logout" element={<LoginScreen />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
