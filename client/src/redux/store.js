// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./alertReducer";

const store = configureStore({
  reducer: {
    loader: loaderReducer,
  },
});

export default store;
