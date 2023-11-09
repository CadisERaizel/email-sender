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
import { Button } from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function App() {
  const [templateKey, setTemplateKey] = useState([]);
  const [template, setTemplate] = useState({
    body: "",
    subject: "",
  });
  const [excel, setExcel] = useState(null);
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
    },
  ];

  const handleSend = () => {
    const apiUrl = `http://localhost:5555/send-mails/?body=${template.body}&subject=${template.subject}`; // Replace with your desired URL
    console.log(excel);

    // Make a GET request using Axios
    if (template.body !== "" && template.subject !== "") {
      console.log(template)
      let formData = new FormData();
      formData.append("xlsxFile", excel)
      axios({
        method: "post",
        url: apiUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          // Handle the successful response here
          console.log("Response data:", response.data);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });
    } else {
      console.log("empty:" + template);
    }
  };
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
          <div className="order-last self-center">
            <Button
              size="sm"
              className="w-24 inline-flex bg-light-blue-400"
              onClick={handleSend}
            >
              Send
              <PaperAirplaneIcon
                strokeWidth={2}
                className="h-4 w-4 bg-light-blue-400"
              />
            </Button>
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
              <Component
                templateKey={templateKey}
                excel={excel}
                setExcel={setExcel}
                template={template}
                setTemplate={setTemplate}
                setTemplateKey={setTemplateKey}
              />
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
}

export default App;
