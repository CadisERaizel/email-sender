import React, { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Select, Option, Button } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";

const TemplateScreen = (props) => {
  const templateKey = props.templateKey;
  const [selectedKey, setSelectedKey] = useState(null);
  const [templateContent, setTemplateContent] = useState("");
  var modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };

  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  useEffect(() => {},[selectedKey])

  const handleProcedureContentChange = (content) => {
    console.log("content---->", content);
    setTemplateContent(content);
  };

  const handleClick = () => {
    if (selectedKey == null) {
      console.log("nothing selected");
    } else {
      setTemplateContent(templateContent + `{${selectedKey}}`);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedKey(e);
    console.log(selectedKey)
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
            value={selectedKey}
            onChange={handleSelectChange}
          >
            {templateKey.map((key) => (
              <Option key={key.toString()} value={key.toString()}>
                {key}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-span-1">
          <Button
            className="flex items-center gap-3"
            size="md"
            onClick={handleClick}
          >
            <PlusIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={templateContent}
        onChange={handleProcedureContentChange}
        style={{ height: "calc(100vh - 100px)", color: "black" }}
      ></ReactQuill>
    </>
  );
};

export default TemplateScreen;
