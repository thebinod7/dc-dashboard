import React, { createContext, useReducer } from "react";
import categoryReducer from "../reducers/categoryReducer";
import * as api from "../services/category";

const initialState = {
  categoryData: {},
  allCategories: [],
};

export const CategoryContext = createContext(initialState);
export const CategoryContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  function listAllCategory() {
    return new Promise((resolve, reject) => {
      api
        .listAllCategory()
        .then((res) => {
          dispatch(listAllCategorySucess(res));
          resolve(res);
        })
        .catch((err) => {
          dispatch(listAllCategoryFail(err));
          reject(err);
        });
    });
  }

  function listAllCategorySucess(res) {
    return {
      type: "LIST_ALL_CATEGORY",
      res,
    };
  }

  function listAllCategoryFail(res) {
    return {
      type: "LIST_ALL_CATEGORY_FAIL",
      res,
    };
  }

  function addCategory(payload) {
    return new Promise((resolve, reject) => {
      api
        .addCategory(payload)
        .then((res) => {
          dispatch(addCategorySuccess(res));
          resolve(res);
        })
        .catch((err) => {
          dispatch(addCategoryFail(err));
          reject(err);
        });
    });
  }

  function addCategorySuccess(res) {
    return {
      type: "ADD_CATEGORY",
      res,
    };
  }

  function addCategoryFail(res) {
    return {
      type: "ADD_CATEGORY_FAIL",
      res,
    };
  }

  function listCategory(query) {
    return new Promise((resolve, reject) => {
      api
        .listCategory(query)
        .then((res) => {
          dispatch(listCategorySuccess(res));
          resolve(res);
        })
        .catch((err) => {
          dispatch(listCategoryFail(err));
          reject(err);
        });
    });
  }

  function listCategorySuccess(res) {
    return {
      type: "LIST_CATEGORY",
      res,
    };
  }

  function listCategoryFail(res) {
    return {
      type: "LIST_CATEGORY_FAIL",
      res,
    };
  }

  return (
    <CategoryContext.Provider
      value={{
        categoryData: state.categoryData,
        allCategories: state.allCategories,
        listCategory,
        addCategory,
        listAllCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
