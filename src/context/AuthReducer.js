const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        //...state,
        user: action.payload,
        token: state.token,
      };
    case "SET_TOKEN":
      return {
        //...state,
        user: state.user,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
