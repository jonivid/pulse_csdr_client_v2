import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./uploadFile.css";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { getTableData } from "../../redux/tableDataActions";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getBottomNavigationUtilityClass } from "@mui/material";

export const UploadFile = () => {
  const [data, getFile] = useState({ name: "", path: "" });
  const [parsedData, setParsedData] = useState({}); // progress bar
  const [message, setMessage] = useState("");
  const [fileStatusMsg, setFileStatusMsg] = useState("off");
  const [active, setActive] = useState(false);
  const [uploadBtn, setUploadBtn] = useState(false);
  const el = useRef(); // accessing input element
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFileStatusMsg("off");
    const file = e.target.files[0]; // accessing file
    e.target.value = null;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("papa", results);
        setParsedData({ data: results.data, name: file.name });
      },
    });
  };

  useEffect(() => {
    (async () => {})();
  }, [parsedData]);

  const uploadFile = async () => {
    if (Object.keys(parsedData).length === 0) {
      setMessage("No file uploaded");
      setFileStatusMsg("empty");
      console.log(parsedData, "no file inside");
    } else {
      setMessage("File uploaded successfully");
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/pulse`, parsedData);
      console.log("updating table");
      const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pulse`);
      setProgress(0);
      setActive(true);
      setUploadBtn(true);
      setTimeout(() => {
        setActive(false);
        setFileStatusMsg("on");
        setUploadBtn(false);
        dispatch(getTableData(result.data));
      }, 7800);
    }
  };

  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10,
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div className="file-upload">
        <input
          type="file"
          ref={el}
          onChange={handleChange}
          accept=".csv"
          disabled={uploadBtn}
        />

        {fileStatusMsg === "on" ? (
          <span style={{ color: "green" }}>{message}</span>
        ) : fileStatusMsg === "empty" ? (
          <span style={{ color: "red" }}>{message}</span>
        ) : (
          getBottomNavigationUtilityClass
        )}

        <button onClick={uploadFile} className="upbutton">
          Upload
        </button>
        <hr />
      </div>
      {active ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      ) : null}
    </div>
  );
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

// LinearProgressWithLabel.propTypes = {
//   /**
//    * The value of the progress indicator for the determinate and buffer variants.
//    * Value between 0 and 100.
//    */
//   value: PropTypes.number.isRequired,
// };
