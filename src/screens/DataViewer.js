import React from "react";
import ExcelPage from "../components/ExcelPage";

const DataViewer = (props) => {
  return <ExcelPage templateKey={props.templateKey} setTemplateKey={props.setTemplateKey}/>;
};

export default DataViewer;
