import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import TemplateScreen from "./screens/TemplateScreen";
import { TopNavBar } from "./components/NavBar";
import DataViewer from "./screens/DataViewer";
import { useState } from "react";

function App() {

  const [templateKey, setTemplateKey] = useState([])
  const data = [
    {
      label: "Template",
      value: "template",
      Component: TemplateScreen,
    },
    {
      label: "Emails",
      value: "emails",
      Component: DataViewer,
    },
    {
      label: "Settings",
      value: "settings",
      Component: TemplateScreen,
    }
  ];
  return (
    <>
    <TopNavBar />
    <Tabs value="template">
      <div className="grid grid-cols-2 gap-1">
        <div>
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      </div>
      </div>
      <TabsBody
      animate={{
        initial: { x: 250 },
        mount: { x: 0 },
        unmount: { x: 250 },
      }}
      >
        {data.map(({ value, Component }) => (
          <TabPanel key={value} value={value}>
            <Component templateKey={templateKey} setTemplateKey={setTemplateKey}/>
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
    </>
  );
}

export default App;
