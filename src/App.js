import { TopNavBar } from "./components/NavBar";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import PanelScreen from "./screens/PanelScreen";
import CampaignsScreen from "./screens/CampaignsScreen";


function App() {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <>
      <div className="flex flex-col">

        <TopNavBar setSelectedUser={setSelectedUser} />
        <div className="flex">
          <div>
          </div>

          <BrowserRouter>
            <SideBar />
            <div className="mt-4 p-4 w-full">
              <Routes>
                <Route path="/" element={<CampaignsScreen />} />
                <Route path="/panel" element={<PanelScreen selectedUser={selectedUser} />} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
