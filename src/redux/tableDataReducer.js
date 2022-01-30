import { TABLE_DATA_ACTION } from "./actionConfig";

const initTableState = {
  tableData: [],
  isinValue: ""
};

export default function tableDataReducer(state = initTableState, action) {
  switch (action.type) {
    case TABLE_DATA_ACTION.GET_ALL_TABLE_DATA: {
      const { payload } = action;
      return { ...state, tableData:payload };
    }
    case TABLE_DATA_ACTION.SET_ISIN: {
      const { payload } = action;
      return { ...state, isinValue:payload };
    }

    

    default: {
      return state;
    }
  }
}
