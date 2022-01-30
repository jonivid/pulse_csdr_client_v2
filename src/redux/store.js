import { createStore, combineReducers, compose } from "redux";
import tableDataReducer from "../redux/tableDataReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(tableDataReducer, composeEnhancers());
