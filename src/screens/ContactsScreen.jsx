import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import Contacts from "../components/Contacts";

const ContactsScreen = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const data = [
    {
      label: "Companies",
      value: "companies",
      desc: <Contacts />,
    },
    {
      label: "Contacts",
      value: "contacts",
      desc: <Contacts />,
    },
  ];

  return (
    <div className="h-full">
      <Tabs value={activeTab} className="h-full">
        <div className="flex justify-between">
          <div className="w-1/4">
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
              }}
            >
              {data.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={activeTab === value ? "text-gray-900" : ""}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </div>
        </div>
        <TabsBody className="h-full">
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value} className="h-full">
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default ContactsScreen;
