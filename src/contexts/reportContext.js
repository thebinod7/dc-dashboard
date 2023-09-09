import React, { createContext, useReducer } from "react";
import reportReducer from "../reducers/reportReducer";
import * as api from "../services/reports";

const initialState = {
  counts: {},
};

export const ReportContext = createContext(initialState);
export const ReportContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  function getCounts() {
    return new Promise((resolve, reject) => {
      api
        .getCounts()
        .then((res) => {
          dispatch(getCountSucess(res));
          resolve(res);
        })
        .catch((err) => {
          dispatch(getCountFail(err));
          reject(err);
        });
    });
  }

  function getCountSucess(res) {
    return {
      type: "GET_COUNTS",
      res,
    };
  }

  function getCountFail(res) {
    return {
      type: "GET_COUNT_FAIL",
      res,
    };
  }

  return (
    <ReportContext.Provider
      value={{
        counts: state.counts,
        getCounts,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
