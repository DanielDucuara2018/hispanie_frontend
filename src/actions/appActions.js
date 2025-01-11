export const SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN";
export const SET_ACTIVE_CATEGORY_HEADER = "SET_ACTIVE_CATEGORY_HEADER";
export const SET_ACTIVE_CATEGORY_AGENDA = "SET_ACTIVE_CATEGORY_AGENDA";
export const SET_ACTIVE_CATEGORY_DISCOVER = "SET_ACTIVE_CATEGORY_DISCOVER";

export const CLEAR_STATE = "CLEAR_STATE";

export const setIsLoggedIn = (isLoggedIn) => ({ type: SET_IS_LOGGED_IN, payload: isLoggedIn });
export const setActiveCategoryHeader = (activeCategoryHeader) => ({ type: SET_ACTIVE_CATEGORY_HEADER, payload: activeCategoryHeader });
export const setActiveCategoryAgenda = (activeCategoryAgenda) => ({ type: SET_ACTIVE_CATEGORY_AGENDA, payload: activeCategoryAgenda });
export const setActiveCategoryDiscover = (activeCategoryDiscover) => ({ type: SET_ACTIVE_CATEGORY_DISCOVER, payload: activeCategoryDiscover });

export const clearState = () => ({ type: CLEAR_STATE });
