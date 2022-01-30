import React, { useEffect, useState } from "react";
import { DrawTable } from "../../drawTable/DrawTable";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getTableData } from "../../../redux/tableDataActions";
import { UploadFile } from "../../uploadFile/UploadFile";
import "./home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const stateDataArray = useSelector((state) => state.tableData);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(`http://localhost:3001/pulse`, {
          headers: {
            Authorization: `${sessionStorage.getItem("token") ?? ""}`,
          },
        });
        if (result.data) {
          dispatch(getTableData(result.data));
        }
      } catch (err) {
        navigate("/login");
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="headerPulse"> Equity Pulse CSDR </h1>
      {/* <UploadFile /> */}
      <DrawTable />
    </div>
  );
};
