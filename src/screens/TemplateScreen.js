import React, { useEffect, useState, createRef } from "react";
import {
  Select, Option, Button, Input, Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Editor from "../components/Editor";

const TemplateScreen = (props) => {
  const templateKey = props.templateKey;
  const [selectedKey, setSelectedKey] = useState(null);
  const template = props.template;
  const setTemplate = props.setTemplate;
  const subject = props.subject
  const setSubject = props.setSubject
  const myEditorRef = createRef()

  function insertText() {
    // Access the MyComponent instance using the ref
    const myComponentInstance = myEditorRef.current;

    // Check if the ref is defined to avoid errors
    if (myComponentInstance) {
      myComponentInstance.insertText(selectedKey);
    }
  }

  function insertTextSubject() {
    setSubject(subject + `{${selectedKey}}`)
  }

  const handleProcedureContentChange = (content) => {
    setTemplate(()=>content);
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-2 justify-center align-center mb-3">
        <div className="col-span-3 xl:col-span-1">
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
    </>
  );
};

export default TemplateScreen;
