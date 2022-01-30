// ******************************imports************************************
import React, { useEffect, useMemo, useState } from "react";
import {  useSelector } from "react-redux";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";

import Table from "@mui/material/Table";
import {
  Paper,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./drawTable.css";
import { matchSorter } from "match-sorter";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// ****************************** Body ************************************

export const DrawTable = () => {
  const [tableData, setTableData] = useState([]);
  const stateDataArray = useSelector((state) => state.tableData);
  const [value, setValue] = useState(0);
  const [settlementGroupFilter, setSettlementGroupFilter] =
    useState("Open Trades");
  
  // **************************************************
  const [tradeDate, setTradeDate] = useState([null, null]);
  const [valueDate, setValueDate] = useState([null, null]);

  const tabsHandleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setSettlementGroupFilter("Open Trades");
      setTradeDate([null, null]);
      setValueDate([null, null]);
    }
    if (newValue === 1) {
      setSettlementGroupFilter("Old Settled");
      setTradeDate([null, null]);
      setValueDate([null, null]);
    }
  };

  useEffect(() => {
    (async () => {
      if (stateDataArray) {
        setTableData(
          stateDataArray.filter(
            (row) => row.Settlement_Group === `${settlementGroupFilter}`,
          ),
        );
      } else {
      }
    })();
  }, [stateDataArray]);

  useEffect(() => {
    setTableData(
      stateDataArray.filter(
        (row) => row.Settlement_Group === `${settlementGroupFilter}`,
      ),
    );
  }, [settlementGroupFilter]);

  const [data, setData] = useState(tableData);
  const dataForUseMemo = React.useMemo(() => [...tableData], [tableData]);

  useEffect(() => {
    (async () => {
      setData(dataForUseMemo);
    })();
  }, [dataForUseMemo]);

  const columns = useMemo(
    () =>
      tableData[0]
        ? Object.keys(tableData[0])
            .filter(
              (header) =>
                header !== "field56" &&
                header !== "field57" &&
                header !== "Settlement_Group",
            )
            .map((key) => {
              let obj = {};
              obj.Header = key;
              obj.accessor = key;
              return obj;
            })
        : [],
    [tableData],
  );

  const [originalData] = useState(data);
  const skipResetRef = React.useRef(false);
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true;
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };

  useEffect(() => {
    skipResetRef.current = false;
  }, [data]);

  const resetData = () => {
    // Don't reset the page when we do this
    skipResetRef.current = true;
    setData(originalData);
  };

  // ************************* date filter by type and by values *********************************



  useEffect(() => {
    if (tradeDate[0] && tradeDate[1] && !(valueDate[0] && valueDate[1])) {
      setTableData(
        stateDataArray
          .filter((row) => row.Settlement_Group === `${settlementGroupFilter}`)
          .filter(
            (row) =>
              Date.parse(row.Trade_Date) >= Date.parse(tradeDate[0]) &&
              Date.parse(row.Trade_Date) <= Date.parse(tradeDate[1]),
          ),
      );
    }
    if (!(tradeDate[0] && tradeDate[1]) && valueDate[0] && valueDate[1]) {
      setTableData(
        stateDataArray
          .filter((row) => row.Settlement_Group === `${settlementGroupFilter}`)
          .filter(
            (row) =>
              Date.parse(row.Value_Date) >= Date.parse(valueDate[0]) &&
              Date.parse(row.Value_Date) <= Date.parse(valueDate[1]),
          ),
      );
    }
    if (tradeDate[0] && tradeDate[1] && valueDate[0] && valueDate[1]) {
      setTableData(
        stateDataArray
          .filter((row) => row.Settlement_Group === `${settlementGroupFilter}`)
          .filter(
            (row) =>
              Date.parse(row.Value_Date) >= Date.parse(valueDate[0]) &&
              Date.parse(row.Value_Date) <= Date.parse(valueDate[1]),
          )
          .filter(
            (row) =>
              Date.parse(row.Trade_Date) >= Date.parse(tradeDate[0]) &&
              Date.parse(row.Trade_Date) <= Date.parse(tradeDate[1]),
          ),
      );
    }
  }, [tradeDate, valueDate]);

  
  return (
    <>
      {/* **************** choose between open and old trades ******************** */}
      
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={value}
            onChange={tabsHandleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Open Trades" {...a11yProps(0)} value={0} />
            <Tab label="Old Settled" {...a11yProps(1)} value={1} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {/* Item One */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* Item Two */}
        </TabPanel>
      </Box>
      {/* ********************** date picker - start ********************* */}
      <div id="range-picker">
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="From Trade Date"
              endText="To Trade Date"
              value={tradeDate}
              onChange={(newValue) => {
                setTradeDate(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <Box sx={{ mx: 2 }}></Box>
                  <TextField {...startProps} />
                  <Box></Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
            <DateRangePicker
              startText="From Value Date"
              endText="To Value Date"
              value={valueDate}
              onChange={(newValue) => {
                setValueDate(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <Box></Box>
                  <TextField {...startProps} />
                  <Box></Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Box>
      </div>
      {/* ********************** date picker  - end ********************* */}

      <Table2
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipReset={skipResetRef.current}
      />
    </>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  editable,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return <span>{}</span>;
}

function DefaultColumnFilter1({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value.toUpperCase() || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

// Be sure to pass our updateMyData and the skipReset option
function Table2({ columns, data, updateMyData, skipReset }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
      // Cell: EditableCell,
    }),
    [],
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    filteredRows,
    state: {
      pageIndex,
      pageSize,
      sortBy,
      groupBy,
      expanded,
      filters,
      selectedRowIds,
    },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useGlobalFilter,
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
  );

  // ***************** global search var ***********************
  const [valueF, setValueF] = React.useState(globalFilter);
  const onChangeF = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  // ********************* select filter var ***********************
  let arrayClient = [];
  data.map((row) => {
    arrayClient.push(row.Client);
  });
  let optionsClient = [...new Set(arrayClient)];

  let arrayBS = [];
  data.map((row) => {
    arrayBS.push(row.B_S);
  });
  let optionsBS = [...new Set(arrayBS)];
 console.log(filteredRows)

  // Render the UI for your table
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row" }} id={"box-2"}>
        <Select
          id={"input-field-custom"}
          labelId="demo-simple-select-label"
          defaultValue=""
          select-box
          label="Client"
          onChange={(e) => setFilter("Client", e.target.value)}
          displayEmpty={true}
          renderValue={(value) =>
            value?.length
              ? Array.isArray(value)
                ? value.join(", ")
                : value
              : "Client"
          }
        >
          <MenuItem value={""}>all</MenuItem>
          {optionsClient.map((option, index) => {
            return (
              <MenuItem value={option} key={index}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          id={"input-field-custom"}
          labelId="demo-simple-select-label"
          defaultValue=""
          label="buy/sell"
          onChange={(e) => setFilter("B_S", e.target.value)}
          displayEmpty={true}
          renderValue={(value) =>
            value?.length
              ? Array.isArray(value)
                ? value.join(", ")
                : value
              : "B/S"
          }
        >
          <MenuItem value={""}>all</MenuItem>
          {optionsBS.map((option, index) => {
            return (
              <MenuItem value={option} key={index}>
                {option}
              </MenuItem>
            );
          })}
        </Select>

        <TextField
          id={"input-field-custom"}
          label="ISIN"
          variant="outlined"
          placeholder="ISIN"
          onChange={(e) => setFilter("ISIN", e.target.value.toUpperCase())}
        />
        <TextField
          id={"input-field-custom"}
          label="Sub Account"
          variant="outlined"
          placeholder="Sub Account"
          onChange={(e) =>
            setFilter("Sub_Account", e.target.value.toUpperCase())
          }
        />
        <TextField
          id={"input-field-custom"}
          label="Quantity"
          variant="outlined"
          placeholder="Quantity"
          onChange={(e) => setFilter("Quantity", e.target.value)}
        />
        <TextField
          id={"input-field-custom"}
          label="Code"
          variant="outlined"
          placeholder="Code"
          onChange={(e) => setFilter("Code", e.target.value.toUpperCase())}
        />

        <TextField
          id={"input-field-custom"}
          value={valueF || ""}
          onChange={(e) => {
            setValueF(e.target.value);
            onChangeF(e.target.value);
          }}
          label="Search All"
          variant="outlined"
          placeholder="Search All"
        />
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "60vh" }}>
          <Table {...getTableProps()} stickyHeader aria-label="simple table">
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers
                    .filter(
                      (column) => column !== "",
                      // && column.Header !== "Settlement_Group",
                    )
                    .map((column) => (
                      <TableCell {...column.getHeaderProps()} id="tableH">
                        <div>
                          <span {...column.getSortByToggleProps()}>
                            {column.render("Header")}
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </div>
                        {/* Render the columns filter UI */}
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <StyledTableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <StyledTableCell {...cell.getCellProps()}>
                          {cell.render("Cell", { editable: true })}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
              id="th-input"
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50, +data.length].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span> | Row result number {filteredRows.length}</span>

        </div>
      </Paper>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
function roundedMedian(leafValues) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
