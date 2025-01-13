import { SET_IS_LOGGED_IN, SET_ACTIVE_CATEGORY_HEADER, SET_ACTIVE_CATEGORY_AGENDA, SET_ACTIVE_CATEGORY_DISCOVER, CLEAR_STATE } from "../actions/appActions";

const initialState = {
  isLoggedIn: false,
  activeCategoryHeader: "agenda",
  activeCategoryAgenda: "/agenda/all",
  activeCategoryDiscover: "/discover/artistas",
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    case SET_ACTIVE_CATEGORY_HEADER:
      return { ...state, activeCategoryHeader: action.payload };
    case SET_ACTIVE_CATEGORY_AGENDA:
      return { ...state, activeCategoryAgenda: action.payload };
    case SET_ACTIVE_CATEGORY_DISCOVER:
      return { ...state, activeCategoryDiscover: action.payload };
    case CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

export default appReducer;
