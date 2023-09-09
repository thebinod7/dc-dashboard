export default (state, action) => {
  switch (action.type) {
    case "LIST_CATEGORY":
      return {
        ...state,
        categoryData: action.res.data,
      };

    case "ADD_CATEGORY":
      return {
        ...state,
        categoryData: action.res.data,
      };

    case "ADD_CATEGORY_FAIL":
      return state;

    case "LIST_ALL_CATEGORY":
      return {
        ...state,
        allCategories: action.res,
      };

    default:
      return state;
  }
};
