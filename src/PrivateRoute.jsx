import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TopNavBar } from './components/NavBar';
import SideBar from './components/SideBar';
import CampaignsScreen from './screens/CampaignsScreen';
import PanelScreen from './screens/PanelScreen';
import WhiteBoard from './screens/WhiteBoard';
import InboxScreen from './screens/InboxScreen';
import AddAccount from "./screens/AddAccount";
import ContactsScreen from './screens/ContactsScreen';
const PrivateRoute = () => {
    const [selectedUser, setSelectedUser] = useState(null)
    return (
        <div className="flex flex-col font-segoe">
            <TopNavBar setSelectedUser={setSelectedUser} />
            <div className="flex h-[calc(100vh-66px)]">
                <SideBar />
                <div className="p-4 pb-0 w-full h-full">
                    <Routes>
                        <Route path="/" element={<CampaignsScreen />} />
                        <Route path="/inbox" element={<InboxScreen />} />
                        <Route path="/panel" element={<PanelScreen selectedUser={selectedUser} />} />
                        <Route path="/board" element={<WhiteBoard />} />
                        <Route path="/contacts" element={<ContactsScreen />} />
                        <Route path='/add-account/:user_id' element={<AddAccount />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
};

export default PrivateRoute;
