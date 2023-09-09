export default (state, action) => {
  switch (action.type) {
    case "LIST_ARTICLES":
      return {
        ...state,
        articleData: action.res.data,
      };

    case "MY_ARTICLES":
      return {
        ...state,
        myArticleData: action.res.data,
      };

    case "ADD_ARTICLE":
      return {
        ...state,
        articleData: action.res.data,
      };

    case "GET_ARTICLE_DETAILS":
      return {
        ...state,
        articleDetails: action.res.data,
      };

    case "UPDATE_ARTICLE":
      return {
        ...state,
        articleDetails: action.res.data,
      };

    case "ADD_ARTICLE_FAIL":
      return state;

    default:
      return state;
  }
};
