import {TABLE_DATA_ACTION} from './actionConfig'


export function getTableData(payload) {
  return {
    type:TABLE_DATA_ACTION.GET_ALL_TABLE_DATA ,
    payload,
  };
}
export function setIsin(payload) {
  return {
    type:TABLE_DATA_ACTION.SET_ISIN,
    payload,
  };
}