import React, { useEffect, useState, createRef } from "react";
import {
  Select, Option, Button, Input, Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  CardHeader,
  CardBody,
  List,
  Card,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Editor from "../components/Editor"
import { useTemplateStore } from "../hooks/TemplateStore";

const TemplateScreen = (props) => {
  const templates = useTemplateStore()
  const templateKey = props.templateKey;
  const [selectedKey, setSelectedKey] = useState(null);
  const template = props.template;
  const setTemplate = props.setTemplate;
  const subject = props.subject
  const setSubject = props.setSubject
  const myEditorRef = createRef()
  const [searchTerm, setSearchTerm] = useState('');

  function insertText() {
    // Access the MyComponent instance using the ref
    const myComponentInstance = myEditorRef.current;

    // Check if the ref is defined to avoid errors
    if (myComponentInstance) {
      myComponentInstance.insertText(selectedKey);
    }
  }

  useEffect(() => {
    templates.fetchList()
  }, [])

  const filteredTemplates = templates.templateList.filter(item =>
    item.template_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function insertTextSubject() {
    setSubject(subject + `{${selectedKey}}`)
  }

  const handleProcedureContentChange = (content) => {
    setTemplate(() => content);
  };

  return (
    <>
      <div className="flex gap-4 w-full">
        <div className="w-1/4">
          <Card className="h-[calc(100vh-200px)]">
            <div className="pt-4 px-2">
              <Typography variant="h6" className="px-2 pb-2">Email Templates</Typography>
              <Input
                label="Search"
        
                value={searchTerm}
                icon={<MagnifyingGlassIcon className="w-4 h-4" />} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <hr className="my-2 border-blue-gray-50" />
            <CardBody className="p-0">
              <List>
                {filteredTemplates.map((template) => (
                  <ListItem id={template.id} className="rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">
                    <div id={template.id} className="flex flex-col">
                      <Typography id={template.id} variant='h6' className='text-md pb-1'>{template.template_name}</Typography>
                      <Typography id={template.id} variant='small' className='text-xs'>{" "}Subject: {template.subject}</Typography>
                    </div>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>

        </div>
        <div className="w-3/4">
          <div className="grid grid-cols-6 gap-2 justify-center align-center mb-3">
            <div className="col-span-3 xl:col-span-2">
              <Select
                className="min-w-min"
                color="teal"
                label="Add Values"
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    disabled: true,
                    className:
                      "flex items-center opacity-100 px-0 gap-2 pointer-events-none text-black",
                  })
                }
                onChange={(e) => setSelectedKey(e)}
              >
                {templateKey.map((key) => (
                  <Option key={key.toString()} value={key.toString()}>
                    {key}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-span-1">
              <Menu placement="right-start">
                <MenuHandler>
                  <Button
                    className="flex items-center gap-3 bg-light-blue-500"
                    size="md"
                  >
                    <PlusIcon strokeWidth={2} className="h-4 w-4 bg-light-blue-500" />
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={insertText}>Add to body</MenuItem>
                  <MenuItem onClick={insertTextSubject}>Add to Subject</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
          <div className="mb-2">
            <Input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
              }}
            />
          </div>
          <div className="h-[calc(100vh-300px)] xl:h-[calc(100vh-300px)] text-black">
            <Editor ref={myEditorRef} handleChange={handleProcedureContentChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateScreen;
