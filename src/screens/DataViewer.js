import React from "react";
import ExcelPage from "../components/ExcelPage";

const DataViewer = (props) => {
    const excel = props.excel;
    const setExcel = props.setExcel;
  return <ExcelPage templateKey={props.templateKey} excel={excel} setExcel={setExcel} setTemplateKey={props.setTemplateKey}/>;
};

export default DataViewer;
