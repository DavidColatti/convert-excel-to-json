import React, { useState } from "react";
import XLSX from "xlsx";
import { make_cols } from "./makeCols";
import { SheetJSFT } from "./types";

const App = () => {
  const [info, setInfo] = useState({ file: {}, data: [], cols: [] });

  const handleChange = (e) => {
    const files = e.target.files;

    if (files && files[0]) {
      setInfo({
        ...info,
        file: files[0],
      });
    }
  };

  const handleFile = () => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });

      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* Convert array of arrays */
      const newData = XLSX.utils.sheet_to_json(ws);

      /* Update state */
      setInfo({
        ...info,
        data: newData,
        cols: make_cols(ws["!ref"]),
      });
    };

    if (rABS) {
      reader.readAsBinaryString(info.file);
    } else {
      reader.readAsArrayBuffer(info.file);
    }

    console.log(info.data);
  };

  return (
    <div>
      <input
        type="file"
        id="my_file_input"
        accept={SheetJSFT}
        onChange={handleChange}
      />
      <input type="submit" value="Process Triggers" onClick={handleFile} />
    </div>
  );
};

export default App;
