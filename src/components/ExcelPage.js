import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import * as XLSX from "xlsx";

export default function ExcelPage(props) {
  const setTemplateKey = props.setTemplateKey;
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming there's only one sheet in the Excel file
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse the sheet data into JSON format
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData[0]);
        setTemplateKey(jsonData[0]);
        setExcelData(jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {excelData && (
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {excelData[0].map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head.toUpperCase()}
                    </Typography>
                  </th>
                ))}
                <th
                  key={Object.keys(excelData[0]).length + 1}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    STATUS
                  </Typography>
                </th>
                <th
                  key={Object.keys(excelData[0]).length + 2}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    OPTIONS
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((data, index) => {
                const isLast = index === excelData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    {data.map((INFO, infokey) => {
                      return (
                        <td key={infokey} className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {INFO}
                          </Typography>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
