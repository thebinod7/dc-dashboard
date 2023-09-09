export default (state, action) => {
  switch (action.type) {
    case "GET_COUNTS":
      return {
        ...state,
        counts: action.res.data,
      };

    default:
      return state;
  }
};
