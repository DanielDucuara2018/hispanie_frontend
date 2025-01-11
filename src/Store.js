import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./reducers/appReducer";

// Configuration object for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers and wrap them with persistReducer
const rootReducer = combineReducers({
  appRootReducer: persistReducer(persistConfig, appReducer),
});

const store = createStore(rootReducer);
const persistor = persistStore(store);

export { store, persistor };
