import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Button
} from "@material-tailwind/react";
import TemplateScreen from "./screens/TemplateScreen";
import { TopNavBar } from "./components/NavBar";
import DataViewer from "./screens/DataViewer";
import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import SettingsScreen from "./screens/SettingsScreen";
import { ReactComponent as Loader } from "./assets/svgs/loader.svg"

function App() {
  const [templateKey, setTemplateKey] = useState([]);
  const [template, setTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedUser, setSelectedUser] = useState(null)
  const [excel, setExcel] = useState(null);
  const [sending, setSending] = useState(false)
  const [emailKey, setEmailKey] = useState(null);
  const [emailCount, setEmailCount] = useState("")
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
      Component: SettingsScreen,
    }
  ];
  const [verify, setVerify] = useState(true)
  const [interval, setInterval] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setEmailCount("")
    setOpenDialog(!openDialog)
  }
  const handleSend = async () => {
    setSending(true)
    var body = encodeURIComponent(template)
    const apiUrl = `http://localhost:55555/send-mails/?user=${Number(selectedUser)}&body=${body}&subject=${subject}&verify=${verify}&interval=${interval}&emailKey=${emailKey}`; // Replace with your desired URL

    // Make a GET request using Axios
    if (template !== "" && subject !== "" && selectedUser !== null) {

      let formData = new FormData();
      formData.append("xlsxFile", excel)
      var response = await axios({
        method: "post",
        url: apiUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log(response)
      setEmailCount(response.data.sent_count)
    } else {
      console.log(template);
    }
    setSending(false)
  };
  return (
    <>
      <TopNavBar setSelectedUser={setSelectedUser} />
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
          <div className="justify-self-end pr-8">
            <Button
              className="flex items-center gap-3 bg-light-blue-500"
              size="md"
              onClick={handleOpenDialog}
            >
              Send<PaperAirplaneIcon strokeWidth={2} className="h-5 w-5 rounded-full bg-light-blue-500" />
            </Button>
          </div>
        </div>
        <TabsBody
        >
          {data.map(({ value, Component }) => (
            <TabPanel key={value} value={value}>
              <Component
                templateKey={templateKey}
                excel={excel}
                setExcel={setExcel}
                template={template}
                setTemplate={setTemplate}
                subject={subject}
                setSubject={setSubject}
                setTemplateKey={setTemplateKey}
                setVerify={setVerify}
                interval={interval}
                setInterval={setInterval}
              />
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
      <Dialog
        open={openDialog}
        size={"sm"}
        handler={handleOpenDialog}
        dismiss={{ enabled: sending ? false : true }}
      >
        <DialogHeader className="text-sm">Select Email Column</DialogHeader>
        <DialogBody>
          <Select
            className="min-w-min"
            color="teal"
            label="Column"
            selected={(element) =>
              element &&
              React.cloneElement(element, {
                disabled: true,
                className:
                  "flex items-center opacity-100 px-0 gap-2 pointer-events-none text-black",
              })
            }
            onChange={(e) => setEmailKey(e)}
          >
            {templateKey.map((key) => (
              <Option key={key.toString()} value={key.toString()}>
                {key}
              </Option>
            ))}
          </Select>
          <p>{emailCount !== "" ? `Sent Emails :${emailCount}` : ""}</p>
        </DialogBody>
        <DialogFooter className="flex justify-center content-center">
          <Button
            className="flex items-center gap-3 bg-light-blue-500"
            size="md"
            onClick={handleSend}
          >
            {sending ? ((<>Sending<Loader /></>)) : (<>Send<PaperAirplaneIcon strokeWidth={2} className="h-5 w-5 rounded-full bg-light-blue-500" /></>)}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default App;
