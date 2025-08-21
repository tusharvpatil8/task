// import { PERSIST_STORE_NAME } from "../constants/app.constant";
// import rootReducer from "./rootReducer";
// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const middlewares = [];

// const persistConfig = {
//   key: PERSIST_STORE_NAME,
//   keyPrefix: "",
//   storage,
//   whitelist: ["auth"],
// };

// const store = configureStore({
//   reducer: persistReducer(persistConfig, rootReducer()),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       immutableCheck: false,
//       serializableCheck: false,
//     }).concat(middlewares),
//   devTools: process.env.NODE_ENV === "development",
// });

// store.asyncReducers = {};

// export const persistor = persistStore(store);

// export const injectReducer = (key, reducer) => {
//   if (store.asyncReducers[key]) {
//     return false;
//   }
//   store.asyncReducers[key] = reducer;
//   store.replaceReducer(
//     persistReducer(persistConfig, rootReducer(store.asyncReducers))
//   );
//   persistor.persist();
//   return store;
// };

// export default store;


// store/store.js
import { PERSIST_STORE_NAME } from "../constants/app.constant";
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createWrapper } from 'next-redux-wrapper';

const middlewares = [];

const persistConfig = {
  key: PERSIST_STORE_NAME,
  keyPrefix: "",
  storage,
  whitelist: ["auth"],
};

// Create a function to make the store
const makeStore = () => {
  const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer()),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(middlewares),
    devTools: process.env.NODE_ENV === "development",
  });

  store.__persistor = persistStore(store); // Attach persistor to store
  store.asyncReducers = {};

  return store;
};

// Create the wrapper
export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === 'development' });

// Export individual store and persistor for client-side use
export const makeStoreInstance = makeStore;
export const store = makeStore();
export const persistor = persistStore(store);

export const injectReducer = (key, reducer) => {
  if (store.asyncReducers[key]) {
    return false;
  }
  store.asyncReducers[key] = reducer;
  store.replaceReducer(
    persistReducer(persistConfig, rootReducer(store.asyncReducers))
  );
  persistor.persist();
  return store;
};

export default store;