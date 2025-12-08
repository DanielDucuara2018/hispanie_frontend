import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./reducers/appReducer";

// Configuration object for redux-persist
const persistConfig = {
  key: "hispanie",
  storage,
  whitelist: ['isLoggedIn', 'activeCategoryHeader', 'activeCategoryAgenda', 'activeCategoryDiscover'], // Only persist these fields
};

// Wrap the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, appReducer);

// Combine reducers (keeping structure for future scalability)
const rootReducer = combineReducers({
  appRootReducer: persistedReducer,
});

// Create store with Redux DevTools support
const store = createStore(
  rootReducer,
  process.env.REACT_APP_ENABLE_REDUX_DEVTOOLS === 'true' && 
  typeof window !== 'undefined' && 
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
);

const persistor = persistStore(store);

export { store, persistor };
