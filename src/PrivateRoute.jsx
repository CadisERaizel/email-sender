import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TopNavBar } from './components/NavBar';
import SideBar from './components/SideBar';
import CampaignsScreen from './screens/CampaignsScreen';
import PanelScreen from './screens/PanelScreen';
import WhiteBoard from './screens/WhiteBoard';
import InboxScreen from './screens/InboxScreen';
const PrivateRoute = () => {
    const [selectedUser, setSelectedUser] = useState(null)
    return (
        <div className="flex flex-col font-segoe">
            <TopNavBar setSelectedUser={setSelectedUser} />
            <div className="flex">
                <div>
                </div>
                <SideBar />
                <div className="mt-4 p-4 w-full">
                    <Routes>
                        <Route path="/" element={<CampaignsScreen />} />
                        <Route path="/inbox" element={<InboxScreen />} />
                        <Route path="/panel" element={<PanelScreen selectedUser={selectedUser} />} />
                        <Route path="/board" element={<WhiteBoard />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
};

export default PrivateRoute;
